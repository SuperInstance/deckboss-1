"""Profile management — add, list, browse agent profiles."""
import os
import json
import urllib.request

PROFILES_DIR = os.path.expanduser("~/.deckboss/profiles")

def handle_profiles_command(args):
    if not args:
        _list_profiles()
    elif args[0] == "add":
        if len(args) < 3:
            print("Usage: deckboss profiles add <name> <github-org-or-url>")
            return
        _add_profile(args[1], args[2])
    elif args[0] == "list":
        _list_profiles()
    elif args[0] == "browse":
        if len(args) < 2:
            print("Usage: deckboss profiles browse <profile-name>")
            return
        _browse_profile(args[1])
    else:
        print(f"Unknown profiles command: {args[0]}")
        print("Commands: add, list, browse")

def _add_profile(name: str, source: str):
    """Add a profile source (GitHub org or URL)."""
    os.makedirs(PROFILES_DIR, exist_ok=True)
    
    # Store profile reference
    profile_path = os.path.join(PROFILES_DIR, f"{name}.yaml")
    
    if "/" in source and not source.startswith("http"):
        # GitHub org/user
        github_source = f"https://github.com/{source}"
    else:
        github_source = source
    
    with open(profile_path, "w") as f:
        f.write(f"name: {name}\nsource: {github_source}\n")
    
    print(f"Profile '{name}' added from {github_source}")
    print("Run 'deckboss profiles browse {name}' to see available agents")

def _list_profiles():
    """List available profiles."""
    from rich.console import Console
    from rich.table import Table
    
    console = Console()
    
    # Built-in profiles
    built_in = [
        ("lucineer/marine", "IoT in marine environments, local-first edge"),
    ]
    
    # Custom profiles
    custom = []
    if os.path.exists(PROFILES_DIR):
        import yaml
        for fname in os.listdir(PROFILES_DIR):
            if fname.endswith(".yaml"):
                with open(os.path.join(PROFILES_DIR, fname)) as f:
                    p = yaml.safe_load(f)
                    custom.append((p["name"], p.get("source", "?")))
    
    table = Table(title="Agent Profiles")
    table.add_column("Profile", style="bold cyan")
    table.add_column("Description")
    
    for name, desc in built_in + custom:
        table.add_row(name, desc)
    
    console.print(table)

def _browse_profile(profile_ref: str):
    """Browse agents available in a profile."""
    parts = profile_ref.split("/")
    if len(parts) == 2:
        github_user = parts[0]
    else:
        github_user = "Lucineer"
    
    try:
        url = f"https://api.github.com/users/{github_user}/repos?per_page=100&sort=updated"
        req = urllib.request.Request(url, headers={"User-Agent": "deckboss/0.1.0"})
        with urllib.request.urlopen(req, timeout=10) as r:
            repos = json.loads(r.read())
        
        # Filter for likely agent repos
        agents = [r for r in repos 
                  if r.get("description") and 
                  any(kw in r["description"].lower() for kw in 
                      ["agent", "fleet", "monitor", "sensor", "marine", "edge", "robot"])]
        
        from rich.console import Console
        from rich.table import Table
        console = Console()
        
        table = Table(title=f"Agents in {github_user}")
        table.add_column("Repo", style="bold cyan")
        table.add_column("Description")
        table.add_column("Pull Command")
        
        for r in sorted(agents, key=lambda x: x.get("updated_at", ""), reverse=True)[:20]:
            name = r["name"]
            desc = (r.get("description") or "")[:50]
            table.add_row(name, desc, f"deckboss pull {github_user}/{name}")
        
        console.print(table)
        
    except Exception as e:
        print(f"Failed to browse profile: {e}")
