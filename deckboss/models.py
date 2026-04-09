"""Model management — loading, selection, generation."""
import subprocess
import urllib.request
import json
from .config import get_api_key


def check_ollama() -> bool:
    try:
        r = subprocess.run(["ollama", "list"], capture_output=True, text=True, timeout=5)
        return r.returncode == 0
    except (FileNotFoundError, subprocess.TimeoutExpired):
        return False


def list_ollama_models() -> list:
    try:
        r = subprocess.run(["ollama", "list"], capture_output=True, text=True, timeout=5)
        if r.returncode == 0:
            lines = r.stdout.strip().split("\n")[1:]
            return [line.split()[0] for line in lines if line.strip()]
    except Exception:
        pass
    return []


def ollama_pull(model_name: str, timeout: int = 300) -> bool:
    """Pull a model. Returns True on success."""
    try:
        r = subprocess.run(["ollama", "pull", model_name],
            capture_output=True, text=True, timeout=timeout)
        return r.returncode == 0
    except subprocess.TimeoutExpired:
        return False
    except Exception:
        return False


def pick_best_local_model(models: list) -> str:
    """Auto-select the best model from available local models."""
    if not models:
        return "phi3:mini"

    # Priority order: prefer reasoning > coding > general > tiny
    priorities = [
        ("deepseek", "r1"),  # DeepSeek Reasoner
        ("qwen3.5",),        # Qwen 3.5 (great general)
        ("deepseek", "v3"),  # DeepSeek V3
        ("qwen3",),          # Qwen 3
        ("nemotron",),       # Nvidia Nemotron
        ("moondream",),      # Moondream (vision)
        ("phi3",),           # Phi-3
    ]

    for p in priorities:
        for m in models:
            ml = m.lower()
            if all(k in ml for k in p):
                return m

    return models[0]


PROVIDERS = {
    "deepseek": {
        "endpoint": "https://api.deepseek.com/v1/chat/completions",
        "models": {
            "deepseek-chat": {"max_tokens": 4096, "context": 64_000},
            "deepseek-reasoner": {"max_tokens": 4096, "context": 64_000},
        },
    },
    "zai": {
        "endpoint": "https://open.bigmodel.cn/api/paas/v4/chat/completions",
        "models": {
            "glm-4-flash": {"max_tokens": 4096, "context": 128_000},
            "glm-5-turbo": {"max_tokens": 8192, "context": 128_000},
        },
    },
    "deepinfra": {
        "endpoint": "https://api.deepinfra.com/v1/chat/completions",
        "models": {
            "Qwen/Qwen3.5-397B-A17B": {"max_tokens": 4000, "context": 32_000},
            "meta-llama/Llama-4-Scout-17B-16E-Instruct": {"max_tokens": 4096, "context": 128_000},
        },
    },
    "siliconflow": {
        "endpoint": "https://api.siliconflow.com/v1/chat/completions",
        "models": {
            "deepseek-ai/DeepSeek-V3": {"max_tokens": 4096, "context": 64_000},
            "ByteDance/Seed/Seed-OSS-36B-Instruct": {"max_tokens": 4096, "context": 32_000},
        },
    },
}


def generate_response(config: dict, model_cfg: dict, messages: list) -> str:
    """Generate a response using configured model."""
    engine = model_cfg.get("engine", "cloud")
    source = model_cfg.get("source", "cloud")

    if source == "local" and engine == "ollama":
        return _ollama_generate(model_cfg["model"], messages)
    elif source == "cloud":
        return _cloud_generate(config, model_cfg, messages)
    else:
        return f"Unsupported engine: {engine}/{source}. Use ollama or cloud."


def _ollama_generate(model: str, messages: list) -> str:
    """Generate using local Ollama."""
    # Build a clean prompt from message history
    parts = []
    for m in messages[-8:]:  # Last 8 messages
        role = "User" if m["role"] == "user" else "Assistant"
        parts.append(f"{role}: {m['content']}")
    parts.append("Assistant:")

    prompt = "\n".join(parts)

    try:
        r = subprocess.run(
            ["ollama", "run", model, prompt],
            capture_output=True, text=True, timeout=180)
        if r.returncode == 0:
            return r.stdout.strip()
        return f"Ollama error: {r.stderr[:200]}"
    except subprocess.TimeoutExpired:
        return "Generation timed out (180s). Try a smaller model."
    except Exception as e:
        return f"Ollama error: {e}"


def _cloud_generate(config: dict, model_cfg: dict, messages: list) -> str:
    """Generate using cloud API."""
    provider = model_cfg.get("provider", "deepseek")
    env_var = model_cfg.get("env", "")
    api_key = get_api_key(config, env_var)

    if not api_key:
        return f"No API key for {provider}. Set {env_var} in ~/.deckboss/secrets.yaml or env."

    prov_cfg = PROVIDERS.get(provider)
    if not prov_cfg:
        return f"Unknown provider: {provider}. Known: {', '.join(PROVIDERS.keys())}"

    model = model_cfg.get("model", "")
    model_info = prov_cfg["models"].get(model, {"max_tokens": 2048})

    body = json.dumps({
        "model": model,
        "messages": [{"role": m["role"], "content": m["content"]}
                     for m in messages[-12:]],
        "temperature": 0.7,
        "max_tokens": model_info["max_tokens"],
    }).encode()

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    try:
        req = urllib.request.Request(
            prov_cfg["endpoint"], data=body, headers=headers)
        with urllib.request.urlopen(req, timeout=90) as r:
            data = json.loads(r.read())
            return data["choices"][0]["message"]["content"]
    except urllib.error.HTTPError as e:
        body = e.read().decode()[:200] if e.fp else ""
        return f"{provider} API error ({e.code}): {body}"
    except Exception as e:
        return f"{provider} error: {e}"
