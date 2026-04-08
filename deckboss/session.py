"""Vibe-coding session — the main AI interaction loop."""
import os
from .character_sheet import CharacterSheet
from .models import generate_response

class Session:
    def __init__(self, config: dict, sheet: CharacterSheet):
        self.config = config
        self.sheet = sheet
        self.messages = []
        self._init_system_prompt()
    
    def _init_system_prompt(self):
        """Build the system prompt based on character sheet."""
        hw = self.sheet.hw
        profile = self.sheet.profile
        role = self.sheet.role
        models = self.sheet.models
        
        self.system_prompt = f"""You are Deckboss, an AI assistant for edge robotics and IoT system design.

## Your Hardware
- Device: {hw.get('device', 'Unknown')}
- RAM: {hw.get('ram_gb', '?')} GB
- VRAM: {hw.get('vram_gb', 'N/A')} GB (shared)
- Pipeline: {self.sheet.resources.get('pipeline_mode', 'serial')}
- Model engine: {self.sheet.resources.get('model_engine', 'ollama')}

## Your Role
Profile: {profile}
Role: {role}

## Available Models
{chr(10).join(f'- {name}: {cfg.get("engine")} {cfg.get("source")} {cfg.get("model", "")}' for name, cfg in models.items())}

## How You Work
1. Listen to what the user needs (marine monitoring, robotics, content management, etc.)
2. Ask clarifying questions about their specific setup and requirements
3. Propose a system design with specific components, wiring, and software architecture
4. Suggest git-agent repos that would implement the design
5. Help the user refine the design through iteration
6. When ready, suggest running `deckboss handoff` to deploy to Cocapn

## Git-Agent Architecture
Every system component becomes a git-agent repo in ~/.deckboss/agents/. Each agent has:
- README.md: What the agent does
- agent.yaml: Configuration (inputs, outputs, model preferences)
- skills/: What the agent knows (markdown knowledge files)
- equipment/: What the agent perceives through (sensor configs)

## Guidelines
- Be specific about hardware: part numbers, wire gauges, sensor models
- Consider the resource constraints of the Jetson (8GB shared VRAM)
- Prefer local models for privacy at sea; cloud for heavy tasks when internet available
- The character sheet determines resource allocation — respect it
- If cameras are connected, the resource plan is different than text-only
- Suggest agents from the Lucineer profile first, then other profiles
- Keep responses practical and actionable"""

        self.messages = [{"role": "system", "content": self.system_prompt}]
    
    def send(self, user_input: str) -> str:
        """Send a user message and get a response."""
        self.messages.append({"role": "user", "content": user_input})
        
        # Select the best model for this task
        model_cfg = self.sheet.get_model_for_task(user_input)
        
        # Generate response
        response = generate_response(self.config, model_cfg, self.messages)
        
        self.messages.append({"role": "assistant", "content": response})
        
        return response

def start_session(agent_name: str):
    """Start a session focused on a specific agent."""
    from rich.console import Console
    from rich.prompt import Prompt
    
    console = Console()
    agents_dir = os.path.expanduser("~/.deckboss/agents")
    agent_path = os.path.join(agents_dir, agent_name)
    
    if not os.path.exists(agent_path):
        console.print(f"[red]Agent '{agent_name}' not found. Run: deckboss pull {agent_name}[/]")
        return
    
    # Load agent config
    import yaml
    agent_yaml_path = os.path.join(agent_path, "agent.yaml")
    agent_config = {}
    if os.path.exists(agent_yaml_path):
        with open(agent_yaml_path) as f:
            agent_config = yaml.safe_load(f) or {}
    
    console.print(Panel(
        f"[bold cyan]Agent: {agent_name}[/]\n"
        f"[dim]{agent_config.get('description', 'No description')}[/]"
    ))
    
    # Load the global config and character sheet
    from .config import load_config
    from .character_sheet import CharacterSheet
    
    config = load_config()
    sheet = CharacterSheet(config)
    session = Session(config, sheet)
    
    # Add agent context to system prompt
    session.messages[-1]["content"] += f"\n\n## Active Agent: {agent_name}\n"
    if agent_config.get("skills"):
        session.messages[-1]["content"] += f"Skills: {', '.join(agent_config['skills'])}\n"
    if agent_config.get("equipment"):
        session.messages[-1]["content"] += f"Equipment: {', '.join(agent_config['equipment'])}\n"
    
    console.print("[dim]Type your questions. 'back' to return to main Deckboss, 'quit' to exit.[/]")
    
    while True:
        try:
            user_input = Prompt.ask(f"\n[bold cyan]{agent_name} >[/]")
            if not user_input.strip():
                continue
            if user_input.strip().lower() in ("back", "quit"):
                break
            
            response = session.send(user_input)
            from rich.markdown import Markdown
            console.print(Markdown(response))
        except KeyboardInterrupt:
            console.print("\n[dim]Use 'back' to return.[/]")
