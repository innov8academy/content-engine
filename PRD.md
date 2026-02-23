# Content Engine — Product Requirements Document v2

## Vision
The most powerful personal content creation platform ever built. Multi-agent AI orchestration that knows Alex's voice, scrapes the internet for trends, and produces near-final content autonomously. Not an assistant — a content team.

**This is also Founders Clone v2** — dogfood first, then ship to creators worldwide.

---

## Architecture: Multi-Agent Orchestration

This isn't one AI helping you write. This is **6 specialized agents** working together like a content production company.

```
┌─────────────────────────────────────────────────────────────┐
│                    CONTENT ENGINE                            │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ SCOUT    │  │ VOICE    │  │ WRITER   │  │ EDITOR   │   │
│  │ Agent    │──│ Agent    │──│ Agent    │──│ Agent    │   │
│  │          │  │          │  │          │  │          │   │
│  │ Research │  │ Style    │  │ Scripts  │  │ Briefs   │   │
│  │ Trends   │  │ Tone     │  │ Hooks    │  │ Scenes   │   │
│  │ Scraping │  │ Learning │  │ CTAs     │  │ B-roll   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                             │
│  ┌──────────┐  ┌──────────┐                                │
│  │ CALENDAR │  │ CRITIC   │                                │
│  │ Agent    │  │ Agent    │                                │
│  │          │  │          │                                │
│  │ Schedule │  │ Quality  │                                │
│  │ Cron     │  │ Scoring  │                                │
│  │ Remind   │  │ Feedback │                                │
│  └──────────┘  └──────────┘                                │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              ORCHESTRATOR (OpenClaw)                  │   │
│  │  Routes tasks │ Manages pipeline │ Cron scheduling   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              FRONTEND (Next.js + shadcn)             │   │
│  │  Dashboard │ Script Editor │ Calendar │ Briefs       │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## The Six Agents

### 1. 🔍 SCOUT Agent — Research & Intelligence
**Purpose:** Continuously scans the internet for content opportunities.

**Capabilities:**
- **Instagram Scraping (Apify):**
  - Scrape competitor accounts (posts, engagement, hashtags, posting times)
  - Track trending reels in AI/tech niche
  - Analyze hashtag performance
  - Monitor Alex's own post performance
  - Scrape comments for audience pain points
  - Track follower growth across competitors
- **Web Trend Scanning:**
  - Twitter/X via bird CLI (AI space, indie hackers)
  - YouTube trending in tech/AI
  - Reddit (r/artificial, r/ChatGPT, r/IndianCreators)
  - Google Trends for emerging topics
  - Product Hunt for new AI tools
  - Hacker News front page
  - Brave Search for breaking news
- **Competitor Intelligence:**
  - Track 10-15 competitor accounts
  - Analyze their content patterns
  - Identify gaps Alex can fill
  - Alert on viral content in the niche

**Cron Schedule:**
- Every 6 hours: Quick trend scan
- Daily 6 AM IST: Full competitor scrape + trend report
- Weekly Sunday: Deep analysis + weekly opportunity report

**Output:** Structured trend reports, idea seeds with data backing, competitor moves.

---

### 2. 🎙️ VOICE Agent — Style & Tone Engine
**Purpose:** Learns and maintains Alex's unique voice for each channel.

**How It Learns:**
1. **Video Ingestion:**
   - Alex uploads past videos (or links YouTube/Instagram URLs)
   - Whisper transcribes audio to text
   - Agent analyzes: sentence structure, word choice, humor style, transitions, energy level
2. **Script Analysis:**
   - Feed past scripts (manual or scraped from captions)
   - Extract patterns: hook style, CTA approach, storytelling structure
3. **Voice Profile per Channel:**
   - @innov8.ai voice: Educational, authoritative, trend-aware, English
   - @alextom.ai voice: Raw, personal, founder-vibe, conversational English
   - @innov8.academy voice: Tutorial, approachable, Malayalam, AI-native
4. **Continuous Learning:**
   - Every time Alex edits a script, the agent learns from the diff
   - "What did Alex change? Why? Update voice model."
   - Feedback loop: Alex rates generated content → agent adjusts

**Voice Profile Storage:**
```json
{
  "channel": "@innov8.ai",
  "language": "en",
  "energy": "high",
  "formality": 0.4,
  "humor_frequency": 0.3,
  "hook_style": "question_or_bold_claim",
  "signature_phrases": ["here's the thing", "let me show you"],
  "avoid_phrases": ["in this video", "don't forget to like"],
  "sentence_length": "short_to_medium",
  "cta_style": "value_first",
  "storytelling": true,
  "examples": [/* best scripts as reference */]
}
```

**Output:** Voice profiles that other agents use. When Writer Agent generates a script, it passes through Voice Agent for tone matching.

---

### 3. ✍️ WRITER Agent — Script Generation
**Purpose:** Produces near-final scripts that sound like Alex.

**Capabilities:**
- **Full Script Generation:**
  - Takes: idea (from Scout) + voice profile (from Voice Agent) + channel specs
  - Produces: Complete script with hook, body, CTA, visual cues
  - Generates 3 variations for the hook (Alex picks best)
  - Handles English AND Malayalam natively
- **Script Templates:**
  - Tool Review, Tutorial, Hot Take, Story, Listicle, Comparison, Behind-the-Scenes
  - Each template has a proven structure
  - Templates are learnable — new ones from analyzing viral content
- **Refinement Pipeline:**
  - Draft → Voice Check → Critic Review → Final
  - Each pass improves the script
  - Writer receives Critic's feedback and revises
- **Hook Mastery:**
  - Database of 500+ proven hooks (scraped from viral reels)
  - Pattern matching: "This [thing] just changed everything" → adapt to topic
  - A/B hook generation: emotional vs logical vs curiosity
- **CTA Engine:**
  - Context-aware CTAs based on content type
  - Comment triggers with keyword automation
  - Freebie suggestions that match the topic
- **Malayalam Engine:**
  - Not translation — native Malayalam generation
  - Uses Gemini Pro for Indic language quality
  - Maintains colloquial Kerala Malayalam (not formal)

**Model Strategy:**
| Sub-task | Model | Why |
|----------|-------|-----|
| Initial draft | Claude Opus | Best long-form quality |
| Hook variations | Claude Sonnet + GPT-4o | Generate diverse options |
| Refinement | Claude Opus | Deep editing capability |
| Malayalam | Gemini 2.0 Pro | Best Indic language |
| Quick iterations | Claude Haiku / GPT-4o-mini | Speed for minor tweaks |

---

### 4. 📋 EDITOR Agent — Production Briefs
**Purpose:** Turns scripts into complete editing documents.

**Capabilities:**
- **Scene Breakdown:**
  - Parse script into timestamped scenes
  - Each scene: narration, visual, text overlay, transition, duration
- **B-roll Intelligence:**
  - Suggest specific b-roll for each scene
  - Search terms for stock footage sites
  - AI-generated visual concepts (via KIE)
  - Reference screenshots from similar videos
- **Music Direction:**
  - Mood per scene (upbeat, dramatic, chill)
  - BPM suggestions
  - Specific track recommendations (royalty-free libraries)
  - Beat drop timing for transitions
- **Thumbnail Generation:**
  - 3 thumbnail concepts per video
  - Text overlay suggestions
  - Color palette based on channel brand
  - AI-generated thumbnail mockups (KIE)
- **Caption & Hashtags:**
  - Platform-optimized captions
  - Hashtag strategy (mix of high-volume + niche)
  - First comment strategy
- **Export:**
  - Google Docs (auto-create via API)
  - PDF with visual layout
  - WhatsApp-ready text (for quick editor messaging)
  - Notion template

---

### 5. 📅 CALENDAR Agent — Scheduling & Automation
**Purpose:** Manages the content pipeline and keeps Alex on track.

**Capabilities:**
- **Smart Scheduling:**
  - Optimal posting times per channel (from Instagram data)
  - Avoid posting conflicts between channels
  - Balance content types across weeks
- **Pipeline Management:**
  - Track every piece from idea → posted
  - Identify bottlenecks (too many ideas, not enough scripts)
  - Auto-assign deadlines based on posting schedule
- **Cron Jobs (OpenClaw):**
  - Monday 8 AM IST: Trigger Scout → generate weekly ideas → notify Alex
  - Tuesday 8 AM IST: Prepare script workspace → queue ideas for Writer
  - Wednesday 6 AM IST: Generate editor briefs for scripted content
  - Daily 9 PM IST: Pipeline status report to Telegram
  - Weekly Sunday: Performance recap + next week suggestions
- **Notifications:**
  - Telegram alerts for pipeline updates
  - "Your 3 scripts are ready for review"
  - "Editor brief exported for @innov8.ai video"
  - "You haven't opened Content Engine in 3 days — here's what's waiting"

---

### 6. 🎯 CRITIC Agent — Quality Control
**Purpose:** Reviews everything before Alex sees it.

**Capabilities:**
- **Script Quality Scoring:**
  - Hook strength (1-10): Does it stop the scroll?
  - Voice match (1-10): Does it sound like Alex?
  - Value density (1-10): Is every second earning attention?
  - CTA effectiveness (1-10): Will people actually act?
  - Overall score with specific feedback
- **Comparative Analysis:**
  - Compare generated script against Alex's best-performing content
  - Flag if tone drifts from voice profile
  - Suggest specific improvements
- **Fact Checking:**
  - Verify claims about AI tools
  - Check if mentioned tools/features still exist
  - Flag outdated information
- **Engagement Prediction:**
  - Based on historical data + trend alignment
  - Predict relative performance (top 20%, average, risky)
  - Suggest tweaks to improve predicted performance

---

## Agent Orchestration Flow

### Full Pipeline (Monday Auto-Run)

```
[Cron: Monday 8 AM IST]
        │
        ▼
   SCOUT Agent
   - Scrape Instagram competitors (Apify)
   - Scan Twitter/Reddit/YouTube trends
   - Generate 15-20 raw idea seeds
        │
        ▼
   VOICE Agent
   - Filter ideas through channel voice profiles
   - Score idea-channel fit
   - Rank by potential × relevance
        │
        ▼
   CRITIC Agent
   - Review top ideas
   - Score each on: trend timing, audience fit, uniqueness
   - Select top 3 (1 per channel)
        │
        ▼
   WRITER Agent
   - Develop each idea (angle, hook, structure)
   - Generate full script drafts
   - Create 3 hook variations per script
        │
        ▼
   CRITIC Agent (second pass)
   - Score each script
   - Send revision notes to Writer
   - Writer revises
   - Final quality gate
        │
        ▼
   ══════════════════════════════
   📱 NOTIFY ALEX via Telegram
   "Your 3 scripts are ready for review"
   ══════════════════════════════
        │
        ▼
   [Alex reviews in Frontend UI]
   [Edits, approves, requests changes]
        │
        ▼
   VOICE Agent
   - Learn from Alex's edits
   - Update voice profiles
        │
        ▼
   EDITOR Agent
   - Generate briefs for approved scripts
   - Create thumbnails
   - Export to editor format
        │
        ▼
   CALENDAR Agent
   - Schedule posts
   - Set recording reminders
   - Track pipeline status
```

### On-Demand Flow (Alex triggers manually)

```
Alex: "Generate ideas about [topic] for @innov8.ai"
        │
        ▼
   Orchestrator routes to SCOUT + VOICE
        │
        ▼
   SCOUT researches topic (Apify + web)
   VOICE scores against channel profile
        │
        ▼
   Results displayed in Frontend
   Alex picks one → "Script this"
        │
        ▼
   WRITER + CRITIC collaborate
        │
        ▼
   Script in editor, ready for review
```

---

## Data Collection: Learning Alex's Voice

### Video Ingestion Pipeline

```
Alex uploads video / pastes Instagram URL
        │
        ▼
   Apify scrapes video + metadata (if URL)
   OR direct upload to Supabase Storage
        │
        ▼
   Whisper transcribes audio → text
   (local whisper or API)
        │
        ▼
   VOICE Agent analyzes transcript:
   - Sentence patterns
   - Vocabulary frequency
   - Humor markers
   - Energy mapping (intro vs middle vs end)
   - Filler words / signature phrases
   - Hook structure
   - CTA delivery style
        │
        ▼
   Voice Profile updated
   Stored in DB: voice_profiles table
        │
        ▼
   Before/after comparison:
   "Voice match improved from 6.2 → 7.8 after 5 videos"
```

### Minimum viable voice training:
- **5 videos per channel** = basic voice profile
- **15 videos per channel** = strong voice match
- **30+ videos per channel** = near-perfect voice replication

---

## Tech Stack (Final)

### Frontend
- **Next.js 15** (App Router, Server Components, Server Actions)
- **TypeScript** (strict mode)
- **shadcn/ui** + **Tailwind CSS** + **Framer Motion**
- **TipTap** (rich text script editor)
- **@hello-pangea/dnd** (drag-and-drop for kanban/calendar)
- **Recharts** (analytics charts)
- **Zustand** (client state management)

### Backend
- **Next.js API Routes** + **Server Actions**
- **Supabase** (PostgreSQL + Auth + Storage + Realtime)
- **OpenRouter API** (multi-model AI access)
- **KIE API** (image generation)
- **Apify API** (Instagram scraping, web scraping)
- **Brave Search API** (trend research)
- **Whisper** (speech-to-text for voice learning)

### Infrastructure
- **OpenClaw Agents** (agent orchestration, cron scheduling)
- **Vercel** or **EC2** (deployment)
- **Supabase** (managed database)

### OpenClaw Integration
- Each agent = OpenClaw agent with its own SOUL.md
- Orchestrator uses `sessions_spawn` for multi-agent coordination
- Cron jobs for scheduled pipeline runs
- Telegram notifications for pipeline updates
- Frontend calls API routes → API routes trigger OpenClaw agents

---

## Apify Integration

### Scrapers to Use

| Scraper | Purpose | Frequency |
|---------|---------|-----------|
| `apify/instagram-profile-scraper` | Competitor profiles, follower count, bio | Daily |
| `apify/instagram-post-scraper` | Post content, engagement, hashtags | Every 6 hours |
| `apify/instagram-reel-scraper` | Reel views, audio trends | Every 6 hours |
| `apify/instagram-comment-scraper` | Audience pain points, sentiment | Daily |
| `apify/instagram-hashtag-scraper` | Trending hashtags in niche | Daily |
| `apify/google-trends-scraper` | Search trend data | Daily |
| `apify/youtube-scraper` | Trending tech/AI videos | Daily |
| `apify/reddit-scraper` | Relevant subreddit posts | Every 6 hours |

### Competitor List (Initial)
Alex to provide 10-15 accounts to track. Suggested categories:
- AI content creators (English)
- AI content creators (Malayalam/Indian)
- Tech educators
- Indie hackers / founders who create content

### Data Storage
All scraped data stored in Supabase with timestamps. Historical data enables trend analysis over time.

### Cost Estimate (Apify)
- ~$25-50/month for the scraping volume described
- Can optimize with smart scheduling (scrape more during idea gen days)

---

## Database Schema (Supabase)

### Tables

```sql
-- Users (multi-tenant ready for FC 2.0)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'pro', -- free, pro, enterprise (for FC 2.0)
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Channels
CREATE TABLE channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  handle TEXT NOT NULL,
  platform TEXT DEFAULT 'instagram',
  language TEXT DEFAULT 'en',
  audience_size INT,
  content_pillars JSONB DEFAULT '[]',
  tone_guide TEXT,
  dos_and_donts JSONB DEFAULT '{}',
  posting_schedule JSONB DEFAULT '{}',
  avatar_mode BOOLEAN DEFAULT false,
  editor_type TEXT DEFAULT 'external', -- external, self
  color TEXT, -- hex color for UI
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Voice Profiles (learned from videos)
CREATE TABLE voice_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  energy TEXT DEFAULT 'high', -- low, medium, high
  formality DECIMAL(3,2) DEFAULT 0.40, -- 0 (casual) to 1 (formal)
  humor_frequency DECIMAL(3,2) DEFAULT 0.30,
  hook_style TEXT DEFAULT 'question_or_bold_claim',
  signature_phrases TEXT[] DEFAULT '{}',
  avoid_phrases TEXT[] DEFAULT '{}',
  sentence_length TEXT DEFAULT 'short_to_medium',
  cta_style TEXT DEFAULT 'value_first',
  storytelling BOOLEAN DEFAULT true,
  vocabulary_profile JSONB DEFAULT '{}', -- word frequency analysis
  example_scripts TEXT[] DEFAULT '{}', -- best scripts as reference
  training_video_count INT DEFAULT 0,
  voice_match_score DECIMAL(4,2) DEFAULT 0, -- 0-10
  last_trained_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Video Library (for voice learning)
CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  channel_id UUID REFERENCES channels(id),
  source_url TEXT, -- Instagram/YouTube URL
  storage_path TEXT, -- Supabase storage path
  transcript TEXT,
  duration INT, -- seconds
  analysis JSONB, -- voice analysis results
  performance JSONB, -- views, likes, etc
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Ideas
CREATE TABLE ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  channel_id UUID REFERENCES channels(id),
  title TEXT NOT NULL,
  description TEXT,
  angle TEXT,
  hooks JSONB DEFAULT '[]', -- multiple hook options
  format TEXT, -- reel, carousel, story, youtube
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'raw', -- raw, developed, scripted, used, archived
  priority INT DEFAULT 0, -- 1-10
  virality_score INT DEFAULT 0, -- AI predicted
  target_audience TEXT,
  key_points JSONB DEFAULT '[]',
  cta_strategy TEXT,
  references JSONB DEFAULT '[]', -- URLs, screenshots
  source TEXT DEFAULT 'manual', -- manual, scout, trend-scanner
  source_data JSONB, -- raw data from scout/trend
  scout_report JSONB, -- research backing this idea
  ai_metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Scripts
CREATE TABLE scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID REFERENCES ideas(id),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  channel_id UUID REFERENCES channels(id),
  title TEXT NOT NULL,
  hook TEXT,
  hook_variations JSONB DEFAULT '[]', -- 3-5 hook options
  body TEXT,
  cta TEXT,
  outro TEXT,
  full_script TEXT,
  visual_cues JSONB DEFAULT '[]', -- [{timestamp, visual, text_overlay}]
  speaker_notes TEXT,
  word_count INT,
  estimated_duration INT, -- seconds
  template TEXT, -- tool-review, tutorial, hot-take, story, listicle
  style TEXT, -- educational, storytelling, raw, comparison
  language TEXT DEFAULT 'en',
  status TEXT DEFAULT 'draft', -- draft, review, approved, recorded, posted
  version INT DEFAULT 1,
  critic_score JSONB, -- {hook: 8, voice: 7, value: 9, cta: 6, overall: 7.5}
  critic_feedback TEXT,
  ai_metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Script Versions
CREATE TABLE script_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  script_id UUID REFERENCES scripts(id) ON DELETE CASCADE,
  version INT NOT NULL,
  full_script TEXT NOT NULL,
  hook TEXT,
  body TEXT,
  cta TEXT,
  changes_summary TEXT,
  edited_by TEXT DEFAULT 'user', -- user, writer-agent, critic-agent
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Editor Briefs
CREATE TABLE editor_briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  script_id UUID REFERENCES scripts(id),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  channel_id UUID REFERENCES channels(id),
  scenes JSONB DEFAULT '[]', -- [{scene_num, narration, visual, text_overlay, broll, transition, duration}]
  music_mood TEXT,
  music_suggestions JSONB DEFAULT '[]',
  music_bpm INT,
  thumbnail_concepts JSONB DEFAULT '[]', -- [{concept, text, style, image_url}]
  caption TEXT,
  hashtags TEXT[] DEFAULT '{}',
  first_comment TEXT,
  reference_videos JSONB DEFAULT '[]',
  editor_notes TEXT,
  status TEXT DEFAULT 'draft', -- draft, sent, revision, completed
  exported_at TIMESTAMPTZ,
  export_format TEXT,
  export_url TEXT, -- Google Doc link, etc
  created_at TIMESTAMPTZ DEFAULT now()
);

-- CTAs & Freebies
CREATE TABLE ctas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  script_id UUID REFERENCES scripts(id),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  cta_type TEXT, -- comment, bio-link, story, dm
  trigger_text TEXT,
  trigger_keyword TEXT, -- for DM automation
  freebie_type TEXT, -- checklist, cheatsheet, guide, template, none
  freebie_title TEXT,
  freebie_content TEXT, -- markdown
  freebie_storage_path TEXT, -- PDF in Supabase
  performance JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Content Calendar
CREATE TABLE calendar_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  channel_id UUID REFERENCES channels(id),
  idea_id UUID REFERENCES ideas(id),
  script_id UUID REFERENCES scripts(id),
  brief_id UUID REFERENCES editor_briefs(id),
  scheduled_date DATE NOT NULL,
  scheduled_time TIME, -- optimal posting time
  status TEXT DEFAULT 'planned', -- planned, scripted, recording, editing, posted
  posted_at TIMESTAMPTZ,
  post_url TEXT,
  performance JSONB DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Competitors (tracked accounts)
CREATE TABLE competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  platform TEXT DEFAULT 'instagram',
  handle TEXT NOT NULL,
  name TEXT,
  follower_count INT,
  category TEXT, -- "ai-creator", "tech-educator", "indie-hacker"
  notes TEXT,
  last_scraped_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Scraped Data (from Apify)
CREATE TABLE scraped_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competitor_id UUID REFERENCES competitors(id) ON DELETE CASCADE,
  platform TEXT DEFAULT 'instagram',
  post_id TEXT UNIQUE, -- platform's post ID
  post_type TEXT, -- reel, carousel, image, story
  caption TEXT,
  hashtags TEXT[] DEFAULT '{}',
  likes INT DEFAULT 0,
  comments INT DEFAULT 0,
  views INT DEFAULT 0, -- for reels
  shares INT DEFAULT 0,
  saves INT DEFAULT 0,
  engagement_rate DECIMAL(6,4),
  posted_at TIMESTAMPTZ,
  media_url TEXT,
  audio_name TEXT, -- for reels
  is_viral BOOLEAN DEFAULT false, -- engagement > 2x average
  analysis JSONB, -- AI analysis of why it worked
  scraped_at TIMESTAMPTZ DEFAULT now()
);

-- Trend Reports (generated by Scout)
CREATE TABLE trend_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  report_type TEXT, -- daily, weekly, on-demand
  sources JSONB DEFAULT '[]', -- which sources were scanned
  trends JSONB DEFAULT '[]', -- [{topic, source, score, data}]
  ideas_generated JSONB DEFAULT '[]', -- idea seeds from trends
  summary TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Agent Runs (track all AI orchestration)
CREATE TABLE agent_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  pipeline TEXT, -- "full-weekly", "idea-gen", "script-gen", "brief-gen"
  agents_involved TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'running', -- running, completed, failed
  input JSONB,
  output JSONB,
  steps JSONB DEFAULT '[]', -- [{agent, action, started, completed, result}]
  total_tokens INT DEFAULT 0,
  total_cost DECIMAL(10,4) DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  error TEXT
);

-- AI Token Usage Log
CREATE TABLE ai_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  agent_run_id UUID REFERENCES agent_runs(id),
  agent TEXT, -- scout, voice, writer, editor, calendar, critic
  task TEXT, -- specific sub-task
  model TEXT,
  provider TEXT, -- openrouter, kie, whisper
  input_tokens INT DEFAULT 0,
  output_tokens INT DEFAULT 0,
  cost DECIMAL(10,6) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_ideas_user_status ON ideas(user_id, status);
CREATE INDEX idx_ideas_channel ON ideas(channel_id);
CREATE INDEX idx_scripts_user_status ON scripts(user_id, status);
CREATE INDEX idx_scripts_idea ON scripts(idea_id);
CREATE INDEX idx_calendar_user_date ON calendar_entries(user_id, scheduled_date);
CREATE INDEX idx_scraped_posts_competitor ON scraped_posts(competitor_id);
CREATE INDEX idx_scraped_posts_viral ON scraped_posts(is_viral) WHERE is_viral = true;
CREATE INDEX idx_trend_reports_user_date ON trend_reports(user_id, created_at);
CREATE INDEX idx_agent_runs_user ON agent_runs(user_id, started_at);
```

---

## Frontend Pages

### Layout
```
┌──────────────────────────────────────────────────┐
│  Sidebar (collapsible)          │   Main Content  │
│                                 │                 │
│  🏠 Dashboard                   │                 │
│  💡 Ideas                       │                 │
│  ✍️ Scripts                     │                 │
│  📋 Briefs                      │                 │
│  📅 Calendar                    │                 │
│  🎯 CTAs                        │                 │
│  🔍 Trends                      │                 │
│  📊 Analytics                   │                 │
│  🎙️ Voice Training             │                 │
│  👥 Competitors                 │                 │
│  ⚙️ Settings                    │                 │
│                                 │                 │
│  ─────────────                  │                 │
│  Channel Switcher:              │                 │
│  🔵 innov8.ai                   │                 │
│  🟣 alextom.ai                  │                 │
│  🟢 innov8.academy              │                 │
│  🌐 All Channels                │                 │
└──────────────────────────────────────────────────┘
```

### Page Details

#### `/` — Dashboard
- **Hero Stats:** Posts this week (0/3), streak, ideas in bank, scripts ready
- **Pipeline Kanban:** Drag cards between: Idea → Developing → Scripted → Approved → Recording → Editing → Posted
- **This Week's Content:** 3 cards (one per channel) showing current status
- **Recent Activity:** Agent runs, script updates, new ideas
- **Quick Actions:** "🚀 Generate Weekly Ideas", "✍️ Start Script", "📋 Create Brief"
- **Agent Status:** Show which agents ran recently, next scheduled run

#### `/ideas` — Idea Bank
- **Filters:** Channel, status, tag, date range, source (AI/manual/trend)
- **Sort:** Priority, date, virality score
- **Bulk Actions:** Develop selected, archive, assign to channel
- **"Generate Ideas" Button:** Opens wizard:
  1. Select channel(s)
  2. Optional: specific topic/theme
  3. Optional: reference URL
  4. Click "Scout" → shows real-time agent progress
  5. Results appear as cards with scores

#### `/ideas/[id]` — Idea Detail
- **Full idea with development:**
  - 3 angle options (AI generated, Alex picks)
  - Hook suggestions
  - Key points outline
  - Target audience definition
  - Reference content (scraped examples)
  - Competitor gap analysis
- **Actions:** "Script This" → goes to Script Studio

#### `/scripts` — Script List
- **Cards with preview:** First line of hook, word count, duration, critic score
- **Filter by:** Channel, status, template, date
- **Sort by:** Date, critic score, status

#### `/scripts/[id]` — Script Studio ⭐ (Core Screen)
- **Left Panel — Script Editor (TipTap):**
  - Sections: Hook | Body | CTA | Outro
  - Each section collapsible
  - Word count + estimated duration per section
  - Speaker notes (collapsible annotations)
  - Inline AI: Select text → "Rewrite", "Expand", "Simplify", "Translate to Malayalam"
- **Right Panel — AI Assistant:**
  - Chat interface with Writer + Critic agents
  - "Generate hook variations" → shows 5 options inline
  - "Make it punchier" → rewrites with diff view
  - "Critic review" → scores + specific feedback
  - "Malayalamize" → full Malayalam conversion
  - Real-time streaming responses
- **Top Bar:**
  - Channel badge (colored)
  - Status dropdown (draft → review → approved)
  - Version history dropdown
  - "Create Brief →" button
- **Bottom Bar:**
  - Visual cues timeline (what appears on screen when)
  - Sync with script sections

#### `/scripts/[id]/brief` — Editor Brief
- **Scene Cards:**
  - Each scene: narration excerpt, visual direction, b-roll notes, text overlay, transition, duration
  - Reorder scenes with drag-and-drop
  - Edit individual scenes
- **Sidebar:**
  - Music mood + suggestions
  - Thumbnail concepts (3 AI-generated)
  - Caption preview
  - Hashtags (click to add/remove)
  - Reference videos
- **Export Bar:**
  - "Copy All" (clipboard)
  - "Download PDF"
  - "WhatsApp Format" (plain text, editor-friendly)
  - "Google Doc" (future)

#### `/calendar` — Content Calendar
- **Monthly View:** Cells with channel-colored dots
- **Weekly View:** Detailed cards per day per channel
- **Drag-and-drop:** Move content between dates
- **Click date → "Schedule content" → pick from scripted ideas
- **Status indicators:** Empty slots highlighted red (missing content)

#### `/trends` — Trend Intelligence
- **Latest Trend Report:** AI-generated summary of what's trending
- **Source Breakdown:** Twitter, YouTube, Reddit, Instagram tabs
- **Viral Posts:** Scraped posts with high engagement (with analysis of why they worked)
- **Competitor Moves:** What competitors posted, engagement data
- **"Run Scan Now" button:** Trigger Scout agent on demand

#### `/voice` — Voice Training
- **Upload Videos:** Drag-and-drop or paste URLs
- **Processing Status:** Show transcription + analysis progress
- **Voice Profile Card per Channel:**
  - Radar chart: energy, humor, formality, storytelling, etc
  - Signature phrases list
  - Avoid phrases list
  - Training progress bar (X/15 videos)
  - Voice match score
- **Test Voice:** Input text → "Does this sound like me?" → score

#### `/competitors` — Competitor Tracking
- **Add Competitor:** Paste Instagram handle
- **Competitor Cards:** Follower count, avg engagement, posting frequency
- **Deep Dive:** Click → see scraped posts, top content, content patterns
- **Alerts:** Notify when competitor posts viral content (>2x avg engagement)

#### `/settings` — Settings
- **AI Models:** Default model per agent, override per task
- **API Keys:** OpenRouter, KIE, Apify, Brave Search
- **Notifications:** Telegram settings, notification preferences
- **Cron Schedule:** View/edit agent schedules
- **Usage:** Token consumption, cost tracking, model breakdown

---

## UI Design System

### Theme
- **Dark mode first** (primary), light mode toggle
- **Color palette:**
  - Background: `#09090B` (zinc-950)
  - Card: `#18181B` (zinc-900)
  - Border: `#27272A` (zinc-800)
  - Text: `#FAFAFA` (zinc-50)
  - Muted: `#A1A1AA` (zinc-400)
- **Channel colors:**
  - @innov8.ai: `#3B82F6` (blue-500)
  - @alextom.ai: `#8B5CF6` (violet-500)
  - @innov8.academy: `#10B981` (emerald-500)
- **Accent:** `#F59E0B` (amber-500) for CTAs and highlights
- **AI/Agent:** `#06B6D4` (cyan-500) for AI-generated content indicators

### Typography
- **UI:** Inter (variable weight)
- **Script editor:** System serif or Georgia for readability
- **Code/technical:** JetBrains Mono

### Components (shadcn/ui)
- Cards, Dialog, Dropdown, Tabs, Badge, Progress, Skeleton
- Command palette (⌘K) for quick navigation
- Toast notifications for agent updates
- Sheet (slide-over) for quick previews

### Animations (Framer Motion)
- Card hover: subtle lift + shadow
- Pipeline transitions: smooth slide between stages
- AI streaming: typing effect for generated content
- Agent status: pulse animation when running

---

## OpenClaw Agent Architecture

### Agent Directory Structure
```
/home/ubuntu/clawd/agents/content-engine/
├── orchestrator/
│   ├── .openclaw/
│   ├── SOUL.md          # Orchestrator personality
│   └── SKILL.md         # Pipeline management logic
├── scout/
│   ├── .openclaw/
│   ├── SOUL.md          # Research-obsessed personality
│   ├── SKILL.md         # Scraping and research logic
│   └── apify-config.json
├── voice/
│   ├── .openclaw/
│   ├── SOUL.md          # Style-obsessed personality
│   └── SKILL.md         # Voice analysis logic
├── writer/
│   ├── .openclaw/
│   ├── SOUL.md          # Creative writer personality
│   ├── SKILL.md         # Script generation logic
│   └── templates/       # Script templates
├── editor/
│   ├── .openclaw/
│   ├── SOUL.md          # Production-minded personality
│   └── SKILL.md         # Brief generation logic
├── critic/
│   ├── .openclaw/
│   ├── SOUL.md          # Harsh but fair reviewer
│   └── SKILL.md         # Quality scoring logic
└── calendar/
    ├── .openclaw/
    ├── SOUL.md          # Scheduling personality
    └── SKILL.md         # Cron and calendar logic
```

### OpenClaw Cron Jobs
```
# Monday 8:00 AM IST (2:30 AM UTC) — Weekly idea generation
kind: cron, expr: "30 2 * * 1", tz: "Asia/Kolkata"
agent: scout → voice → critic
payload: "Run weekly idea generation for all 3 channels"

# Tuesday 8:00 AM IST — Script prep notification  
kind: cron, expr: "30 2 * * 2", tz: "Asia/Kolkata"
payload: "Notify Alex: ideas ready for scripting"

# Daily 6:00 AM IST — Trend scan
kind: cron, expr: "30 0 * * *", tz: "Asia/Kolkata"
agent: scout
payload: "Quick trend scan, update trend dashboard"

# Daily 9:00 PM IST — Pipeline status
kind: cron, expr: "30 15 * * *", tz: "Asia/Kolkata"
agent: calendar
payload: "Send pipeline status report to Telegram"

# Every 6 hours — Instagram scraping
kind: every, everyMs: 21600000
agent: scout
payload: "Scrape competitor posts, update trends"

# Sunday 10:00 AM IST — Weekly recap
kind: cron, expr: "30 4 * * 0", tz: "Asia/Kolkata"
agent: critic + calendar
payload: "Weekly performance recap + next week plan"
```

---

## API Routes

### Content Pipeline
```
POST   /api/ideas/generate        # Trigger Scout + Voice for idea generation
GET    /api/ideas                  # List ideas (filtered)
GET    /api/ideas/[id]             # Get idea detail
PATCH  /api/ideas/[id]             # Update idea
POST   /api/ideas/[id]/develop     # Trigger idea development (Voice + Critic)

POST   /api/scripts/generate       # Trigger Writer for script generation
GET    /api/scripts                # List scripts
GET    /api/scripts/[id]           # Get script detail
PATCH  /api/scripts/[id]           # Update script
POST   /api/scripts/[id]/refine    # AI refinement (Writer)
POST   /api/scripts/[id]/review    # Trigger Critic review
GET    /api/scripts/[id]/versions  # Version history

POST   /api/briefs/generate        # Trigger Editor for brief generation
GET    /api/briefs                 # List briefs
GET    /api/briefs/[id]            # Get brief detail
PATCH  /api/briefs/[id]            # Update brief
POST   /api/briefs/[id]/export     # Export brief (PDF, text, etc)
```

### Intelligence
```
POST   /api/scout/scan             # Trigger trend scan
GET    /api/trends                 # Get latest trend reports
GET    /api/trends/[id]            # Get specific trend report
GET    /api/competitors            # List competitors
POST   /api/competitors            # Add competitor
GET    /api/competitors/[id]/posts # Get scraped posts
```

### Voice
```
POST   /api/voice/upload           # Upload video for training
GET    /api/voice/profiles         # Get voice profiles
GET    /api/voice/profiles/[id]    # Get specific profile
POST   /api/voice/test             # Test voice match on text
```

### Calendar
```
GET    /api/calendar               # Get calendar entries
POST   /api/calendar               # Create entry
PATCH  /api/calendar/[id]          # Update entry
DELETE /api/calendar/[id]          # Remove entry
```

### Agent
```
POST   /api/agents/run             # Trigger agent pipeline
GET    /api/agents/runs            # List agent runs
GET    /api/agents/runs/[id]       # Get run detail
GET    /api/agents/status          # Current agent status
```

### Streaming
```
POST   /api/stream/generate        # SSE endpoint for streaming AI responses
                                    # Used by Script Studio for real-time generation
```

---

## Phase Plan

### Phase 1: Foundation (Days 1-3)
- [ ] Next.js 15 project setup + TypeScript + Tailwind + shadcn
- [ ] Supabase project creation + schema migration
- [ ] Auth (magic link, single user for now)
- [ ] Layout: sidebar + main content area
- [ ] Dashboard skeleton
- [ ] Channel setup UI (seed Alex's 3 channels)
- [ ] Basic navigation between all pages
- [ ] Dark mode theme

### Phase 2: Idea Engine + Scout (Days 4-7)
- [ ] Idea Bank UI (list, filter, cards)
- [ ] Apify integration (Instagram scraper)
- [ ] Scout Agent (OpenClaw agent with scraping + web search)
- [ ] AI idea generation API (OpenRouter)
- [ ] Trend scanner (multi-source)
- [ ] Idea development workflow
- [ ] Idea → channel assignment

### Phase 3: Voice Training (Days 8-10)
- [ ] Video upload/URL input UI
- [ ] Whisper transcription pipeline
- [ ] Voice analysis engine
- [ ] Voice profile storage + display
- [ ] Voice match scoring
- [ ] Channel-specific voice profiles

### Phase 4: Script Studio (Days 11-16)
- [ ] TipTap rich text editor integration
- [ ] AI script generation (streaming via SSE)
- [ ] Writer Agent integration
- [ ] Script templates (5 types)
- [ ] Hook variation generator
- [ ] Refinement tools (inline AI)
- [ ] Critic Agent review + scoring
- [ ] Malayalam generation
- [ ] Version history
- [ ] Voice matching on generated scripts

### Phase 5: Editor Brief + CTA (Days 17-20)
- [ ] Brief auto-generation from scripts
- [ ] Scene breakdown UI
- [ ] B-roll suggestions
- [ ] Music direction
- [ ] Thumbnail concepts (KIE integration)
- [ ] Export formats (PDF, clipboard, WhatsApp)
- [ ] CTA generator
- [ ] Freebie creator

### Phase 6: Calendar + Cron (Days 21-24)
- [ ] Calendar UI (monthly + weekly views)
- [ ] Drag-and-drop scheduling
- [ ] Pipeline status tracking
- [ ] OpenClaw cron job setup
- [ ] Telegram notifications
- [ ] Pipeline dashboard
- [ ] Automated Monday pipeline

### Phase 7: Competitors + Analytics (Days 25-28)
- [ ] Competitor tracking UI
- [ ] Automated competitor scraping
- [ ] Viral content alerts
- [ ] Usage analytics (tokens, cost)
- [ ] Content performance tracking (Phase 2 prep)

### Phase 8: Polish + Ship (Days 28-30)
- [ ] Mobile responsiveness
- [ ] Loading states + error handling
- [ ] Performance optimization
- [ ] Command palette (⌘K)
- [ ] Onboarding flow (for FC 2.0)
- [ ] Documentation

---

## Cost Estimate (Monthly)

| Service | Cost | Notes |
|---------|------|-------|
| OpenRouter (AI models) | $30-80 | Depends on usage, Opus is expensive |
| Apify (scraping) | $25-50 | Smart scheduling reduces cost |
| KIE API (images) | $10-20 | Thumbnail generation |
| Supabase (Pro) | $25 | DB + Auth + Storage |
| Vercel (Pro) | $20 | Or free on EC2 |
| Whisper API | $5-10 | Or free if local |
| **Total** | **$115-205/month** | |

For FC 2.0 students: charge $29-49/month, need ~5-7 students to break even.

---

## Success Metrics

1. **Monday idea gen: < 15 minutes** (currently 2-3 hours) — mostly automated
2. **Tuesday scripting: < 30 minutes for 3 scripts** (currently 3-4 hours) — AI drafts, Alex approves
3. **Wednesday brief prep: < 15 minutes** (currently 1-2 hours) — auto-generated
4. **Consistency: 3 posts/week, every week, no exceptions**
5. **Voice match: > 8/10 on generated scripts** after training
6. **Content quality: Engagement rate maintained or improved**
7. **Alex's time: Content takes 1 day instead of 3**

---

## The Endgame

1. **Month 1:** Alex uses it, refines it, proves it works
2. **Month 2:** Voice profiles are dialed in, pipeline is automatic
3. **Month 3:** Package as FC 2.0, launch to students
4. **Month 6:** SaaS product, $29-49/month, 100+ users
5. **Month 12:** The content creation platform for creators

---

*"No matter the cost. Build the most powerful content engine that exists."*
# Content Engine — Agent Skills & Visual UX

## Part 1: Agent Skill System

### Core Concept
Every agent has **pluggable skills** — modular capabilities they can learn, improve, and share. Skills aren't static prompts. They evolve.

---

### Skill Types

#### 🧠 Built-in Skills (ship with each agent)
Every agent gets these by default:

**1. Self-Reflection**
After every task, the agent asks itself:
- "What worked well?"
- "What could be better?"
- Logs insights to a `lessons.json` file
- Reviews lessons before starting similar tasks

**2. Mistake Journal**
- When Alex edits/rejects AI output → agent analyzes the diff
- "Alex changed my hook from X to Y — why?"
- Stores patterns: `{mistake: "too formal", correction: "use casual tone", frequency: 12}`
- Over time, mistakes decrease because the agent pre-checks against its journal

**3. Style Drift Detection**
- Compares current output against voice profile baseline
- Alerts: "This script is 23% more formal than your usual @innov8.ai tone"
- Auto-corrects before presenting to Alex

**4. Context Memory**
- Remembers what worked for each channel
- "Last 3 @innov8.ai reels about tool reviews averaged 8.2/10 — here's what they had in common"
- Builds a success pattern library per channel

---

#### 🔧 Agent-Specific Skills

**SCOUT Agent Skills:**
| Skill | Description |
|-------|-------------|
| `trend-radar` | Score trends by velocity, relevance, and timing |
| `competitor-decoder` | Analyze WHY competitor content went viral |
| `niche-mapper` | Map content gaps in Alex's niche |
| `hashtag-intelligence` | Track hashtag performance over time |
| `audience-pulse` | Analyze comments/DMs for pain points |
| `platform-algorithm` | Track Instagram algorithm changes |
| `news-filter` | Filter AI news by creator-relevance |

**VOICE Agent Skills:**
| Skill | Description |
|-------|-------------|
| `dialect-tuner` | Fine-tune Malayalam dialect (Kerala colloquial vs formal) |
| `energy-mapper` | Map energy curves in Alex's best videos |
| `humor-detector` | Identify and replicate humor patterns |
| `signature-phrases` | Track and naturally inject Alex's catchphrases |
| `anti-ai-detector` | Ensure output doesn't trigger AI detection |
| `tone-shifter` | Shift tone per content type (tutorial vs hot take) |

**WRITER Agent Skills:**
| Skill | Description |
|-------|-------------|
| `hook-master` | 500+ hook patterns, A/B testing, scroll-stop optimization |
| `story-arc` | Narrative structure for short-form (setup → tension → payoff) |
| `retention-optimizer` | Optimize script for watch-time (front-load value, pattern interrupts) |
| `cta-psychology` | CTA placement and wording for max conversion |
| `script-compression` | Cut scripts to exact duration without losing value |
| `malayalam-native` | Native Malayalam generation (not translation) |
| `trend-riding` | Adapt trending formats to Alex's niche |

**EDITOR Agent Skills:**
| Skill | Description |
|-------|-------------|
| `broll-library` | Curated b-roll suggestions by category |
| `music-matching` | Match music mood to content energy curve |
| `thumbnail-psychology` | Thumbnail design principles that get clicks |
| `caption-optimizer` | Platform-specific caption optimization |
| `editor-shorthand` | Learn each editor's preferences and adapt briefs |

**CRITIC Agent Skills:**
| Skill | Description |
|-------|-------------|
| `engagement-predictor` | Predict relative performance based on historical data |
| `audience-lens` | Review from the audience's perspective |
| `fact-checker` | Verify AI tool claims, features, pricing |
| `trend-timing` | Is this trend too early, perfect, or too late? |
| `competitor-comparison` | How does this compare to top competitor content? |

**CALENDAR Agent Skills:**
| Skill | Description |
|-------|-------------|
| `optimal-timing` | Learn best posting times from performance data |
| `content-balance` | Ensure variety (not 3 tool reviews in a row) |
| `burnout-detector` | Detect when pipeline is overloaded, suggest adjustments |
| `deadline-negotiator` | Smart rescheduling when things slip |

---

#### 📦 Installable Skills (Plugin System)
Skills can be added from:
1. **ClawHub** — Community skill marketplace
2. **Custom** — Alex builds his own
3. **Import** — From other OpenClaw users

**Skill File Format:**
```
/skills/
├── hook-master/
│   ├── SKILL.md          # Instructions for the agent
│   ├── hooks.json        # 500+ hook patterns
│   ├── examples/         # Real examples
│   └── tests/            # Quality checks
├── competitor-decoder/
│   ├── SKILL.md
│   ├── analysis-prompt.md
│   └── scoring-rubric.md
└── ...
```

**Skill Marketplace (Future — FC 2.0):**
- Creators share skills they've built
- "Top Hook Formulas for Tech Niche" — downloadable skill
- "Malayalam Content Optimization" — language-specific skill
- Revenue share for skill creators

---

### Self-Improvement Loop

```
                    ┌─────────────┐
                    │  Agent does  │
                    │    task      │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │ Alex reviews │
                    │ edits/rates  │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
       ┌──────▼──────┐ ┌──▼────┐ ┌─────▼─────┐
       │  Mistake     │ │Voice  │ │ Success   │
       │  Journal     │ │Profile│ │ Pattern   │
       │  updated     │ │tuned  │ │ Library   │
       └──────┬──────┘ └──┬────┘ └─────┬─────┘
              │            │            │
              └────────────┼────────────┘
                           │
                    ┌──────▼──────┐
                    │ Next task is │
                    │   better     │
                    └─────────────┘
```

**Concrete example:**
1. Writer generates a script for @innov8.ai
2. Alex changes the hook from "Did you know that..." to "This tool just broke the internet"
3. Mistake Journal logs: `{pattern: "question_hooks_underperform", channel: "innov8.ai", correction: "bold_claim_hooks_preferred", count: 1}`
4. After 5 similar corrections: Writer stops using question hooks for @innov8.ai
5. Voice Profile updates: `hook_style: "bold_claim"` for this channel
6. Critic now flags question hooks: "Warning: Alex prefers bold claims for this channel"

---

## Part 2: Visual Agent UX

### The Big Question: How do you interact with 6 AI agents?

**Answer: Three modes — Mission Control, War Room, and Direct Chat.**

---

### Mode 1: 🎛️ Mission Control (Dashboard)

The default view. See all agents at a glance.

```
┌─────────────────────────────────────────────────────────────────┐
│  CONTENT ENGINE — Mission Control                    Mon Feb 24 │
│                                                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │
│  │  🔍 SCOUT   │ │  🎙️ VOICE   │ │  ✍️ WRITER   │              │
│  │             │ │             │ │             │              │
│  │  ● ACTIVE   │ │  ○ IDLE     │ │  ○ IDLE     │              │
│  │             │ │             │ │             │              │
│  │  Scanning   │ │  Ready      │ │  3 scripts  │              │
│  │  Twitter... │ │  15 videos  │ │  in queue   │              │
│  │             │ │  trained    │ │             │              │
│  │  ▓▓▓▓▓░░░  │ │  █████████  │ │  ░░░░░░░░░  │              │
│  │  62%        │ │  Match: 8.1 │ │  Waiting    │              │
│  └─────────────┘ └─────────────┘ └─────────────┘              │
│                                                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │
│  │  📋 EDITOR  │ │  📅 CALENDAR│ │  🎯 CRITIC  │              │
│  │             │ │             │ │             │              │
│  │  ○ IDLE     │ │  ● ACTIVE   │ │  ○ IDLE     │              │
│  │             │ │             │ │             │              │
│  │  1 brief    │ │  Scheduling │ │  Last score │              │
│  │  ready      │ │  Wed posts  │ │  8.4/10     │              │
│  │             │ │             │ │             │              │
│  │  ░░░░░░░░░  │ │  ▓▓▓░░░░░  │ │  █████████  │              │
│  │  Waiting    │ │  38%        │ │  Ready      │              │
│  └─────────────┘ └─────────────┘ └─────────────┘              │
│                                                                 │
│  ┌─ Pipeline ─────────────────────────────────────────────────┐ │
│  │ 💡 5 ideas → 📝 3 developing → ✍️ 1 scripted → ✅ 0 done │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─ Recent Activity ─────────────────────────────────────────┐  │
│  │ 🔍 Scout found 3 trending topics in AI space    2 min ago │  │
│  │ 🎯 Critic scored "Cursor AI Review" script: 8.4    1h ago │  │
│  │ 📅 Calendar scheduled 3 posts for this week      3h ago   │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Each agent card:**
- Avatar/emoji + name
- Status: Active (pulsing green) / Idle / Error
- Current task or summary stat
- Progress bar (if running)
- Click → opens agent detail / direct chat

**Click an agent → Slide-over panel:**
- Agent profile (skills, personality)
- Recent tasks + results
- Performance stats
- Skill list (installed skills)
- "Chat with agent" button
- "Run task" button

---

### Mode 2: 💬 War Room (Multi-Agent Chat)

**This is the killer feature.** A shared chat where all agents collaborate — and Alex watches or jumps in.

```
┌─────────────────────────────────────────────────────────────────┐
│  WAR ROOM — Weekly Content Pipeline                             │
│  Agents: Scout, Voice, Writer, Critic     Status: In Progress   │
│─────────────────────────────────────────────────────────────────│
│                                                                 │
│  🔍 Scout                                            9:02 AM   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Found 3 trending topics this morning:                    │   │
│  │                                                          │   │
│  │ 1. 🔥 Cursor AI's new agent mode (velocity: 94)         │   │
│  │ 2. 📈 OpenAI's image gen update (velocity: 87)          │   │
│  │ 3. 🆕 Lovable.dev hitting $4M ARR (velocity: 72)        │   │
│  │                                                          │   │
│  │ Competitor @aitools.daily posted about Cursor yesterday  │   │
│  │ — got 45K views. Gap: no one covered the AGENT mode.     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  🎙️ Voice                                            9:03 AM   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Channel fit analysis:                                    │   │
│  │                                                          │   │
│  │ 🔵 @innov8.ai → Cursor Agent Mode (perfect fit, tool    │   │
│  │    review format, Alex's energy matches this topic)      │   │
│  │ 🟣 @alextom.ai → Lovable.dev story (founder angle,      │   │
│  │    "from $0 to $4M" narrative Alex does well)            │   │
│  │ 🟢 @innov8.academy → OpenAI image gen (tutorial format,  │   │
│  │    great for Malayalam walkthrough)                       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  🎯 Critic                                           9:04 AM   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Quick assessment:                                        │   │
│  │                                                          │   │
│  │ ✅ Cursor Agent Mode — HIGH potential. Trend is fresh,   │   │
│  │    competitor missed the angle. Score: 9.1               │   │
│  │ ✅ Lovable story — GOOD. Founder narrative resonates.    │   │
│  │    Score: 7.8                                            │   │
│  │ ⚠️ OpenAI image gen — RISKY. Topic is already saturated │   │
│  │    from last week. Consider "AI Avatar tools 2025"       │   │
│  │    instead? Score: 5.4                                   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─ 👤 Alex ──────────────────────────────────────────────┐     │
│  │ Agree on Cursor and Lovable. For academy, do the        │     │
│  │ AI avatar tools comparison instead — I have footage.    │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                 │
│  🔍 Scout                                            9:05 AM   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ On it. Researching top AI avatar tools for comparison... │   │
│  │ ▓▓▓▓░░░░░░ 40%                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ✍️ Writer                                           9:05 AM   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Starting script for Cursor Agent Mode (@innov8.ai).     │   │
│  │ Using "tool-review" template with bold-claim hook style. │   │
│  │                                                          │   │
│  │ Hook draft: "Cursor just made every other code editor    │   │
│  │ obsolete — and no one's talking about this feature"      │   │
│  │                                                          │   │
│  │ Want me to continue with this angle?                     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│─────────────────────────────────────────────────────────────────│
│  💬 Type a message...                          [Send] [⚡ Run]  │
│  Agent filter: [All] [Scout] [Voice] [Writer] [Critic]         │
└─────────────────────────────────────────────────────────────────┘
```

**War Room features:**
- **Real-time agent conversation** — See agents discuss and hand off work
- **Alex can jump in anytime** — Approve, redirect, give feedback
- **Agent filter** — Show only specific agents' messages
- **Pipeline sessions** — Each pipeline run is a War Room thread
- **Artifacts** — Scripts, briefs, ideas appear as expandable cards in chat
- **Progress indicators** — See agents working in real-time
- **Decision points** — Agents pause and ask Alex at key moments
- **@ mentions** — Alex can direct questions to specific agents

---

### Mode 3: 🎯 Direct Chat (1-on-1 with Agent)

Click any agent → Full chat interface, just you and that agent.

```
┌─────────────────────────────────────────────────────────────────┐
│  💬 Chat with WRITER                                    ✍️      │
│  Skills: hook-master, story-arc, retention-optimizer            │
│─────────────────────────────────────────────────────────────────│
│                                                                 │
│  👤 Alex                                                        │
│  Write a script about Cursor's new agent mode for @innov8.ai   │
│                                                                 │
│  ✍️ Writer                                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ ## Cursor Agent Mode — @innov8.ai Script                 │   │
│  │                                                          │   │
│  │ **Hook (3 options):**                                    │   │
│  │ 1. "Cursor just dropped a feature that makes it think   │   │
│  │     like a senior developer"                             │   │
│  │ 2. "Every code editor is now obsolete — here's why"     │   │
│  │ 3. "I replaced my entire dev workflow with one button"   │   │
│  │                                                          │   │
│  │ **Body:**                                                │   │
│  │ [full script content...]                                 │   │
│  │                                                          │   │
│  │ **CTA:**                                                 │   │
│  │ "Comment CURSOR and I'll send you my complete setup..."  │   │
│  │                                                          │   │
│  │ 📊 Voice Match: 8.4/10 | ⏱ 58 seconds | 📝 234 words   │   │
│  └──────────────────────────────────────────────────────────┘   │
│  [Use Hook 1] [Use Hook 2] [Use Hook 3]                        │
│  [✏️ Edit] [🎯 Critic Review] [📋 Create Brief] [🔄 Regenerate]│
│                                                                 │
│─────────────────────────────────────────────────────────────────│
│  💬 Type a message...                                   [Send]  │
└─────────────────────────────────────────────────────────────────┘
```

**Direct Chat features:**
- **Full script rendering** with formatting
- **Quick action buttons** contextual to the output
- **Inline metrics** (voice match, duration, word count)
- **One-click handoff** — "Send to Critic" / "Create Brief"
- **History** — All past conversations with this agent

---

### Agent Avatars & Personality

Each agent needs a distinct visual identity. Not generic AI — characters.

| Agent | Avatar | Color | Personality |
|-------|--------|-------|-------------|
| 🔍 Scout | Binoculars / Radar | `#F59E0B` amber | Obsessive researcher. "I found something interesting..." |
| 🎙️ Voice | Waveform / Mic | `#EC4899` pink | Style perfectionist. "This doesn't sound like you." |
| ✍️ Writer | Pen / Typewriter | `#3B82F6` blue | Creative workhorse. "Here's what I've got." |
| 📋 Editor | Clapperboard | `#8B5CF6` violet | Production-minded. "Scene 3 needs stronger b-roll." |
| 🎯 Critic | Target / Magnifier | `#EF4444` red | Brutally honest. "This hook is a 4. Here's why." |
| 📅 Calendar | Clock / Calendar | `#10B981` green | Organized planner. "You're behind on @alextom.ai." |

**Future:** AI-generated agent avatars (actual character designs) using KIE. Each agent has a face.

---

### Navigation Between Modes

```
┌─────────────────────────────────────────┐
│  Top Bar                                │
│                                         │
│  🎛️ Mission Control  │  💬 War Room  │  │
│  (Dashboard)         │  (Multi-chat) │  │
│                                         │
│  Agent Quick-Access:                    │
│  [🔍] [🎙️] [✍️] [📋] [🎯] [📅]         │
│  Click = Direct Chat                   │
│  Hover = Status tooltip                │
└─────────────────────────────────────────┘
```

---

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘K` | Command palette (search everything) |
| `⌘1-6` | Quick switch to agent direct chat |
| `⌘W` | Open War Room |
| `⌘M` | Mission Control |
| `⌘I` | New idea |
| `⌘S` | New script |
| `⌘Enter` | Send message / run pipeline |

---

### Mobile View

On mobile (Alex checking Telegram or on phone):
- **Mission Control** becomes a vertical stack of agent cards
- **War Room** becomes a standard chat (like WhatsApp group)
- **Direct Chat** is native chat UX
- **Swipe between agents** in direct chat mode

**Telegram Integration:**
- War Room can mirror to a Telegram group
- Alex can reply to agents from Telegram
- Push notifications for decision points
- Quick approve/reject via Telegram inline buttons

---

## Part 3: Skill Evolution Roadmap

### Week 1-2: Basic Skills
- Mistake Journal (all agents)
- Self-Reflection (all agents)
- Hook patterns database (Writer)
- Competitor analysis (Scout)
- Voice profile v1 (Voice)

### Week 3-4: Learning Skills
- Feedback loop from Alex's edits
- Success pattern library
- Style drift detection
- Engagement prediction v1

### Month 2: Advanced Skills
- Anti-AI detection
- Malayalam native generation
- Retention optimization
- Music matching
- Thumbnail psychology

### Month 3+: Community Skills (FC 2.0)
- Skill marketplace
- User-created skills
- Skill sharing between creators
- Revenue share model

---

*"Six agents, one mission: Make Alex the most consistent content creator in the AI space."*
