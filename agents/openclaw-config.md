# Content Engine — OpenClaw Setup Guide

## Architecture

```
Content Engine OpenClaw Instance
├── orchestrator (main agent)
│   ├── SOUL.md
│   ├── MEMORY.md
│   └── HEARTBEAT.md (triggers cron-like pipeline runs)
│
├── agents/
│   ├── scout/       → sessions_spawn(agentId="scout")
│   ├── voice/       → sessions_spawn(agentId="voice")
│   ├── writer/      → sessions_spawn(agentId="writer")
│   ├── editor/      → sessions_spawn(agentId="editor")
│   ├── critic/      → sessions_spawn(agentId="critic")
│   └── calendar/    → sessions_spawn(agentId="calendar")
```

## OpenClaw Config (openclaw.json)

Add to `agents.list` in your openclaw.json:

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "anthropic/claude-sonnet-4"
      },
      "workspace": "/path/to/content-engine",
      "maxConcurrent": 4,
      "subagents": {
        "maxConcurrent": 8
      }
    },
    "list": [
      {
        "id": "orchestrator",
        "name": "Content Engine",
        "workspace": "/path/to/content-engine/agents/orchestrator",
        "model": "anthropic/claude-sonnet-4"
      },
      {
        "id": "scout",
        "name": "Scout",
        "workspace": "/path/to/content-engine/agents/scout",
        "model": "anthropic/claude-sonnet-4"
      },
      {
        "id": "voice",
        "name": "Voice",
        "workspace": "/path/to/content-engine/agents/voice",
        "model": "anthropic/claude-sonnet-4"
      },
      {
        "id": "writer",
        "name": "Writer",
        "workspace": "/path/to/content-engine/agents/writer",
        "model": "anthropic/claude-sonnet-4"
      },
      {
        "id": "editor",
        "name": "Editor",
        "workspace": "/path/to/content-engine/agents/editor",
        "model": "openai/gpt-4o"
      },
      {
        "id": "critic",
        "name": "Critic",
        "workspace": "/path/to/content-engine/agents/critic",
        "model": "anthropic/claude-sonnet-4"
      },
      {
        "id": "calendar",
        "name": "Calendar",
        "workspace": "/path/to/content-engine/agents/calendar",
        "model": "openai/gpt-4o-mini"
      }
    ]
  }
}
```

## How It Works

### Orchestrator spawns agents:
```
sessions_spawn(
  agentId="scout",
  task="Generate 5 content ideas for @innov8.ai about AI coding tools",
  mode="run"
)
```

### Pipeline automation (via cron):
```
# Monday 8 AM IST — Full pipeline
cron.add({
  schedule: { kind: "cron", expr: "30 2 * * 1", tz: "Asia/Kolkata" },
  payload: { kind: "agentTurn", message: "Run weekly content pipeline: Scout ideas → Critic score → Writer script top 3 → Critic review → Editor briefs" },
  sessionTarget: "isolated"
})
```

### Agent-to-agent communication:
- Orchestrator spawns Scout → gets ideas
- Orchestrator spawns Critic with ideas → gets scores
- Orchestrator spawns Writer with top ideas → gets scripts
- Orchestrator spawns Critic with scripts → gets reviews
- Orchestrator spawns Editor with approved scripts → gets briefs
- Calendar tracks everything

### Frontend ↔ Agents:
The Next.js app calls API routes → API routes interact with Supabase.
Agents also read/write Supabase directly.
The War Room UI shows agent messages in real-time (via Supabase Realtime).

## Environment Variables (all agents need)
- OPENROUTER_API_KEY
- APIFY_API_KEY
- KIE_API_KEY
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

## Setup Steps
1. Install OpenClaw on a new instance (or use existing)
2. Clone the content-engine repo
3. Add agents to openclaw.json
4. Set environment variables
5. Connect Telegram for notifications
6. Set up cron jobs for automated pipeline
7. Done — the system runs itself
