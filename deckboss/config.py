"""Configuration management."""
import os
import yaml

CONFIG_DIR = os.path.expanduser("~/.deckboss")
CHARACTER_PATH = os.path.join(CONFIG_DIR, "character.yaml")
SECRETS_PATH = os.path.join(CONFIG_DIR, "secrets.yaml")

def load_config() -> dict:
    """Load and merge character sheet and secrets."""
    config = {}
    
    if os.path.exists(CHARACTER_PATH):
        with open(CHARACTER_PATH) as f:
            config.update(yaml.safe_load(f) or {})
    
    if os.path.exists(SECRETS_PATH):
        with open(SECRETS_PATH) as f:
            secrets = yaml.safe_load(f) or {}
            config["secrets"] = secrets
    
    # Also check environment variables for API keys
    env_keys = {k: v for k, v in os.environ.items() 
                if k.endswith("_API_KEY") or k.endswith("_TOKEN")}
    if env_keys:
        if "secrets" not in config:
            config["secrets"] = {}
        config["secrets"].setdefault("api_keys", {}).update(env_keys)
    
    return config

def get_api_key(config: dict, env_var: str) -> str:
    """Get an API key from config or environment."""
    return (config.get("secrets", {}).get("api_keys", {}).get(env_var)
            or os.environ.get(env_var, ""))
