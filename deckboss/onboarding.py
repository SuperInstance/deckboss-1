"""Onboarding wizard — first-run configuration."""
import os
import sys
import yaml

CONFIG_DIR = os.path.expanduser("~/.deckboss")
CHARACTER_PATH = os.path.join(CONFIG_DIR, "character.yaml")
SECRETS_PATH = os.path.join(CONFIG_DIR, "secrets.yaml")

def needs_onboarding() -> bool:
    return not os.path.exists(CHARACTER_PATH)

def _prompt(text, default=""):
    if default:
        result = input(f"  {text} [{default}]: ").strip()
        return result if result else default
    return input(f"  {text}: ").strip()

def _prompt_bool(text, default=False):
    hint = "Y/n" if default else "y/N"
    result = input(f"  {text} ({hint}): ").strip().lower()
    if not result:
        return default
    return result in ("y", "yes")

def _detect_hardware():
    """Detect connected hardware and capabilities."""
    hw = {"device": "Unknown Linux", "ram_gb": 0, "gpu_gb": 0,
          "shared_memory": True, "detected": {}}

    # Device type
    if os.path.exists("/etc/nv_tegra_release"):
        hw["device"] = "Jetson (Tegra)"
        try:
            with open("/etc/nv_tegra_release") as f:
                for line in f:
                    if "BOARD" in line:
                        board = line.split("=")[1].strip()
                        hw["device"] = f"Jetson {board}"
                        break
        except Exception:
            pass
    elif os.path.exists("/proc/device-tree/model"):
        try:
            with open("/proc/device-tree/model") as f:
                model = f.read().strip("\x00")
                hw["device"] = model
        except Exception:
            pass

    # RAM
    try:
        with open("/proc/meminfo") as f:
            for line in f:
                if line.startswith("MemTotal"):
                    kb = int(line.split()[1])
                    hw["ram_gb"] = round(kb / 1024 / 1024, 1)
                    break
    except Exception:
        pass

    # GPU: Jetson uses CMA carveout, desktops use nvidia-smi
    cma_gb = 0
    try:
        with open("/proc/meminfo") as f:
            for line in f:
                if line.startswith("CmaTotal"):
                    kb = int(line.split()[1])
                    cma_gb = round(kb / 1024, 1)
                    break
    except Exception:
        pass

    if os.path.exists("/proc/driver/nvidia/gpus"):
        try:
            import subprocess
            result = subprocess.run(
                ["nvidia-smi", "--query-gpu=memory.total", "--format=csv,noheader"],
                capture_output=True, text=True, timeout=5)
            if result.returncode == 0:
                mb = int(result.stdout.strip().split()[0])
                hw["gpu_gb"] = round(mb / 1024, 1)
                hw["shared_memory"] = False
        except Exception:
            pass
    elif cma_gb > 0:
        hw["gpu_gb"] = cma_gb

    # Storage
    hw["storage"] = "/mnt/nvme" if os.path.exists("/mnt/nvme") else CONFIG_DIR

    # Video devices (cameras)
    video_count = len([d for d in os.listdir("/dev") if d.startswith("video")])
    if video_count > 0:
        hw["detected"]["cameras"] = video_count

    # Audio
    if os.path.exists("/dev/snd"):
        hw["detected"]["audio"] = True

    # GPIO (RPi)
    if os.path.exists("/sys/class/gpio"):
        hw["detected"]["gpio"] = True

    # CUDA via torch
    try:
        import torch
        hw["cuda"] = torch.cuda.is_available()
        if hw["cuda"]:
            hw["gpu_name"] = torch.cuda.get_device_name(0)
    except ImportError:
        hw["cuda"] = False

    return hw


def _detect_local_models():
    """Detect installed local models."""
    found = []
    try:
        import subprocess
        result = subprocess.run(["ollama", "list"],
            capture_output=True, text=True, timeout=5)
        if result.returncode == 0:
            for line in result.stdout.strip().split("\n")[1:]:
                if line.strip():
                    found.append(line.strip().split()[0])
    except Exception:
        pass
    return found


def run_onboarding():
    print("")
    print("=" * 56)
    print("          Deckboss — First Run Setup")
    print("=" * 56)
    print("")

    # 1. Hardware
    print("Step 1/6: Hardware Detection")
    print("  Scanning...")
    hw = _detect_hardware()
    print(f"  Device:      {hw['device']}")
    print(f"  RAM:         {hw['ram_gb']} GB")
    mem_type = "shared" if hw["shared_memory"] else "dedicated"
    print(f"  GPU:         {hw['gpu_gb']} GB ({mem_type})")
    print(f"  CUDA:        {hw.get('cuda', False)}")
    if hw.get("gpu_name"):
        print(f"  GPU Model:   {hw['gpu_name']}")
    print(f"  Storage:     {hw['storage']}")
    for k, v in hw["detected"].items():
        print(f"  Detected:    {k} = {v}")
    print("")

    # 2. Local models
    print("Step 2/6: Local Models")
    local_models = _detect_local_models()
    if local_models:
        print(f"  Found {len(local_models)} model(s):")
        for m in local_models:
            print(f"    - {m}")
    else:
        print("  No local models found.")
        print("  Install: curl -fsSL https://ollama.com/install.sh | sh")
    engine = _prompt("  Model engine", "ollama")
    print("")

    # 3. API keys
    print("Step 3/6: Cloud API Keys (Enter to skip each)")
    api_keys = {}
    providers = [
        ("DeepSeek", "DEEPSEEK_API_KEY"),
        ("z.ai/GLM", "ZAI_API_KEY"),
        ("DeepInfra", "DEEPINFRA_API_KEY"),
        ("SiliconFlow", "SILICONFLOW_API_KEY"),
    ]
    for name, env_var in providers:
        key = _prompt(f"  {name}")
        if key:
            api_keys[env_var] = key
    print(f"  {len(api_keys)} cloud provider(s) configured")
    print("")

    # 4. I/O
    print("Step 4/6: Input/Output")
    io_secondary = []

    if _prompt_bool("  Enable Telegram bot?"):
        io_secondary.append({"type": "telegram", "env": "TELEGRAM_BOT_TOKEN"})
    if _prompt_bool("  Enable Discord bot?"):
        io_secondary.append({"type": "discord", "env": "DISCORD_BOT_TOKEN"})
    if _prompt_bool("  Enable LAN API server?"):
        port = _prompt("  Port", "8080")
        io_secondary.append({"type": "lan_api", "port": int(port)})

    stt = None
    if hw["detected"].get("audio") or _prompt_bool("  Enable speech-to-text?"):
        stt = {"engine": "whisper", "model": "medium"}

    tts = None
    if _prompt_bool("  Enable text-to-speech?"):
        tts = {"engine": "piper", "model": "en_US-lessac-medium"}
    print("")

    # 5. Profile
    print("Step 5/6: Agent Profile")
    print("  lucineer/marine — IoT, marine, local-first edge")
    profile = _prompt("  Profile", "lucineer/marine")
    role = _prompt("  Role", "system-designer")
    print("")

    # 6. Character sheet
    print("Step 6/6: Generating Character Sheet")

    gpu = hw["gpu_gb"]
    overhead = 2.0
    cam_count = hw["detected"].get("cameras", 0)

    if engine == "vllm" or cam_count >= 2:
        pipeline = "parallel"
        max_model = max(1, (gpu - overhead) / 2) if gpu > overhead else 1
    else:
        pipeline = "serial"
        max_model = max(1, gpu - overhead) if gpu > overhead else hw["ram_gb"] - overhead

    # Auto-pick best local model
    primary_model = "phi3:mini"
    for m in local_models:
        ml = m.lower()
        if "qwen3.5" in ml:
            primary_model = m
            break
        if "deepseek" in ml and ("r1" in ml or "v3" in ml):
            primary_model = m
            break

    character = {
        "version": "0.1.0",
        "hardware": hw,
        "resource_plan": {
            "model_engine": engine,
            "max_model_gb": round(max_model, 1),
            "pipeline": pipeline,
        },
        "models": {
            "primary": {"engine": engine, "model": primary_model, "priority": 1},
        },
    }

    if stt:
        character["models"]["stt"] = {**stt, "priority": 3}
    if tts:
        character["models"]["tts"] = {**tts, "priority": 5}
    if "DEEPSEEK_API_KEY" in api_keys:
        character["models"]["reasoning"] = {
            "engine": "cloud", "provider": "deepseek",
            "model": "deepseek-reasoner", "env": "DEEPSEEK_API_KEY", "priority": 2}
    if "ZAI_API_KEY" in api_keys:
        character["models"]["fast"] = {
            "engine": "cloud", "provider": "zai",
            "model": "glm-4-flash", "env": "ZAI_API_KEY", "priority": 2}

    character["io"] = {"primary": "terminal", "secondary": io_secondary}
    character["profile"] = profile
    character["role"] = role

    os.makedirs(CONFIG_DIR, exist_ok=True)
    with open(CHARACTER_PATH, "w") as f:
        yaml.dump(character, f, default_flow_style=False)

    if api_keys:
        with open(SECRETS_PATH, "w") as f:
            yaml.dump({"api_keys": api_keys}, f, default_flow_style=False)
        os.chmod(SECRETS_PATH, 0o600)

    print(f"  Saved to {CHARACTER_PATH}")
    print("")
    print("  Setup complete! Run: deckboss")
    print("")
