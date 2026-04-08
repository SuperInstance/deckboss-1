"""Git-agent management — pull, list, and manage agent repos."""
import os
import subprocess

AGENTS_DIR = os.path.expanduser("~/.deckboss/agents")

def list_agents():
    """List equipped agents."""
    from rich.console import Console
    from rich.table import Table
    
    console = Console()
    
    if not os.path.exists(AGENTS_DIR):
        console.print("[dim]No agents equipped. Run: deckboss pull <profile/agent-name>[/]")
        return
    
    agents = [d for d in os.listdir(AGENTS_DIR) 
              if os.path.isdir(os.path.join(AGENTS_DIR, d)) and 
              os.path.exists(os.path.join(AGENTS_DIR, d, "README.md"))]
    
    if not agents:
        console.print("[dim]No agents equipped. Run: deckboss pull <profile/agent-name>[/]")
        return
    
    table = Table(title="Equipped Agents")
    table.add_column("Agent", style="bold cyan")
    table.add_column("Description")
    
    for agent in sorted(agents):
        readme_path = os.path.join(AGENTS_DIR, agent, "README.md")
        desc = ""
        if os.path.exists(readme_path):
            with open(readme_path) as f:
                first_line = f.readline().strip()
                if first_line.startswith("# "):
                    desc = first_line[2:]
                else:
                    desc = first_line[:60]
        table.add_row(agent, desc[:60])
    
    console.print(table)

def pull_agent(agent_ref: str):
    """Pull an agent from a profile into local agents directory."""
    from rich.console import Console
    
    console = Console()
    
    # Parse profile/agent-name
    parts = agent_ref.split("/")
    if len(parts) == 2:
        profile, agent_name = parts
        repo_url = f"https://github.com/{profile}/{agent_name}"
    elif len(parts) == 1:
        # Default to Lucineer profile
        agent_name = parts[0]
        repo_url = f"https://github.com/Lucineer/{agent_name}"
    else:
        console.print(f"[red]Invalid agent reference: {agent_ref}[/]")
        console.print("Use format: <github-user>/<repo-name> or just <repo-name> for Lucineer")
        return
    
    target_dir = os.path.join(AGENTS_DIR, agent_name)
    
    if os.path.exists(target_dir):
        console.print(f"[yellow]Agent '{agent_name}' already equipped. Updating...[/]")
        subprocess.run(["git", "-C", target_dir, "pull"], capture_output=True)
    else:
        os.makedirs(AGENTS_DIR, exist_ok=True)
        console.print(f"[cyan]Pulling {agent_name} from {repo_url}...[/]")
        result = subprocess.run(
            ["git", "clone", "--depth", "1", repo_url, target_dir],
            capture_output=True, text=True
        )
        if result.returncode != 0:
            console.print(f"[red]Failed to clone: {result.stderr[:200]}[/]")
            return
    
    # Check for agent.yaml
    agent_yaml = os.path.join(target_dir, "agent.yaml")
    if os.path.exists(agent_yaml):
        console.print(f"  [green]Agent config found[/]")
    else:
        console.print(f"  [dim]No agent.yaml found — this repo may not be a deckboss agent[/]")
    
    console.print(f"  [green]Agent '{agent_name}' equipped at {target_dir}[/]")
    console.print(f"  Start a session: [bold]deckboss session {agent_name}[/]")
