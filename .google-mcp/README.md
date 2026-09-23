# Google MCP setup (Search Console + Analytics)

Cursor is configured to run:

- `google-search-console` → `uvx google-search-console-mcp`
- `google-analytics` → `uvx --from google-analytics-mcp ga4-mcp-server`

## 1) Install `uv` (one time)

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
# then restart Terminal / Cursor so `uvx` is on PATH
uvx --version
```

Or: https://docs.astral.sh/uv/getting-started/installation/

## 2) Google Cloud project + APIs

1. Open [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select a project (e.g. `mentr-seo`)
3. Enable APIs:
   - **Google Search Console API**
   - **Google Analytics Data API**
   - **Google Analytics Admin API** (for GA MCP)

## 3) Service account key

1. IAM & Admin → Service Accounts → Create  
   Name: `cursor-mcp-readonly`
2. Create key → JSON → download
3. Save as:

```bash
mkdir -p ~/.config/google-mcp
mv ~/Downloads/your-key.json ~/.config/google-mcp/service-account.json
chmod 600 ~/.config/google-mcp/service-account.json
```

Copy the service account email (looks like `cursor-mcp-readonly@PROJECT.iam.gserviceaccount.com`).

## 4) Grant access in Google products

### Search Console
1. https://search.google.com/search-console  
2. Settings → Users and permissions → Add user  
3. Paste the service account email  
4. Permission: **Full** (or at least Restricted with performance read)

Property URL to use with tools: `https://mentr.in/`  
(If you verified as Domain property, use `sc-domain:mentr.in`)

### Google Analytics 4
1. https://analytics.google.com → Admin → Property access management  
2. Add the same service account email as **Viewer**
3. Copy **Property ID** (numeric, Admin → Property settings)  
4. Put it in `~/.cursor/mcp.json` (and/or this project’s `.cursor/mcp.json`) as `GA4_PROPERTY_ID`

Your Measurement ID `G-ME7KM87RG4` is **not** the Property ID — open GA4 Admin → Property settings for the number.

## 5) Restart Cursor

1. Quit Cursor fully (Cmd+Q)  
2. Reopen this project  
3. **Settings → Cursor Settings → MCP**  
4. Confirm `google-search-console` and `google-analytics` show as connected (green)

## 6) Test in chat

Ask:

- “List my Search Console sites”
- “GSC last 28 days for pages containing snapandgrade”
- “GA4 top pages last 28 days for /snapandgrade”

## Security

- Never commit `service-account.json`
- Keep the key Viewer/readonly
- Rotate the key if it leaks
