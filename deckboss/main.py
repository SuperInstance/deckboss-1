"""Deckboss main entry point."""
import sys
from .onboarding import needs_onboarding, run_onboarding
from .config import load_config
from .tui import DeckbossTUI
from .character_sheet import CharacterSheet

def cli():
    if len(sys.argv) > 1:
        handle_command(sys.argv[1:])
        return

    # Check if first run
    if needs_onboarding():
        run_onboarding()
    
    config = load_config()
    sheet = CharacterSheet(config)
    tui = DeckbossTUI(config, sheet)
    tui.run()

def handle_command(args):
    cmd = args[0]
    
    if cmd == "onboard":
        run_onboarding()
    elif cmd == "status":
        from .config import load_config
        config = load_config()
        sheet = CharacterSheet(config)
        sheet.display()
    elif cmd == "agents":
        from .git_agent import list_agents
        list_agents()
    elif cmd == "pull":
        if len(args) < 2:
            print("Usage: deckboss pull <profile/agent-name>")
            sys.exit(1)
        from .git_agent import pull_agent
        pull_agent(args[1])
    elif cmd == "handoff":
        print("Handoff to Cocapn... (coming soon)")
        print("This will package your agent fleet for Cocapn deployment.")
    elif cmd == "config":
        if len(args) > 1 and args[1] == "edit":
            import os
            editor = os.environ.get("EDITOR", "nano")
            os.system(f"{editor} ~/.deckboss/character.yaml")
        else:
            from .config import load_config
            config = load_config()
            for k, v in config.items():
                if not isinstance(v, dict):
                    print(f"  {k}: {v}")
    elif cmd == "profiles":
        from .profiles import handle_profiles_command
        handle_profiles_command(args[1:])
    elif cmd == "session":
        if len(args) < 2:
            print("Usage: deckboss session <agent-name>")
            sys.exit(1)
        from .session import start_session
        start_session(args[1])
    else:
        print(f"Unknown command: {cmd}")
        print("Commands: onboard, status, agents, pull, handoff, config, profiles, session")
        sys.exit(1)
