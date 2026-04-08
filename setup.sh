#!/bin/bash
set -e

echo "=== Deckboss Setup ==="
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "ERROR: python3 not found. Install Python 3.10+"
    exit 1
fi

PYTHON_VERSION=$(python3 -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')")
echo "Python $PYTHON_VERSION detected"

# Install package
echo "Installing deckboss..."
pip install -e . 2>/dev/null || pip3 install -e . 2>/dev/null

# Create config directory
mkdir -p ~/.deckboss/{agents,models,logs,sessions,profiles}

# Check for common tools
echo ""
echo "Environment check:"
command -v git &> /dev/null && echo "  git: OK" || echo "  git: MISSING (required)"
command -v ollama &> /dev/null && echo "  ollama: OK (local models available)" || echo "  ollama: not installed (run: curl -fsSL https://ollama.com/install.sh | sh)"
command -v nvidia-smi &> /dev/null && echo "  NVIDIA GPU: $(nvidia-smi --query-gpu=name --format=csv,noheader 2>/dev/null || echo 'detected')" || echo "  NVIDIA GPU: not detected (CPU-only mode)"

# Check for CUDA
if python3 -c "import torch; print(torch.cuda.is_available())" 2>/dev/null | grep -q "True"; then
    echo "  CUDA: Available"
else
    echo "  CUDA: Not available (whisper/LLM will use CPU)"
fi

echo ""
echo "Setup complete. Run: deckboss"
echo "On first run, Deckboss will walk you through onboarding."
