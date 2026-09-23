#!/usr/bin/env bash
set -euo pipefail
curl -LsSf https://astral.sh/uv/install.sh | sh
export PATH="$HOME/.local/bin:$PATH"
mkdir -p "$HOME/.config/google-mcp"
echo "uv: $(uv --version)"
echo "uvx: $(uvx --version)"
echo "Prefetching MCP packages (first run can take a minute)..."
uvx --from google-search-console-mcp python -c "print('GSC package OK')"
uvx --from google-analytics-mcp python -c "print('GA4 package OK')"
echo ""
echo "Next: put service-account.json in ~/.config/google-mcp/ and set GA4_PROPERTY_ID in ~/.cursor/mcp.json"
echo "Then fully quit and reopen Cursor."
