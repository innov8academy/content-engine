-- Content Engine Database Schema

-- Channels
CREATE TABLE channels (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  handle TEXT NOT NULL,
  platform TEXT DEFAULT 'instagram',
  language TEXT DEFAULT 'en',
  audience_size INT DEFAULT 0,
  content_pillars JSONB DEFAULT '[]',
  tone_guide TEXT DEFAULT '',
  posting_schedule JSONB DEFAULT '{}',
  avatar_mode BOOLEAN DEFAULT false,
  editor_type TEXT DEFAULT 'external',
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ideas
CREATE TABLE ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id TEXT REFERENCES channels(id),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  angle TEXT DEFAULT '',
  hooks JSONB DEFAULT '[]',
  format TEXT DEFAULT 'reel',
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'raw',
  priority INT DEFAULT 0,
  virality_score INT DEFAULT 0,
  target_audience TEXT DEFAULT '',
  key_points JSONB DEFAULT '[]',
  cta_strategy TEXT DEFAULT '',
  references JSONB DEFAULT '[]',
  source TEXT DEFAULT 'manual',
  source_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Scripts
CREATE TABLE scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID REFERENCES ideas(id),
  channel_id TEXT REFERENCES channels(id),
  title TEXT NOT NULL,
  hook TEXT DEFAULT '',
  hook_variations JSONB DEFAULT '[]',
  body TEXT DEFAULT '',
  cta TEXT DEFAULT '',
  outro TEXT DEFAULT '',
  full_script TEXT DEFAULT '',
  visual_cues JSONB DEFAULT '[]',
  speaker_notes TEXT DEFAULT '',
  word_count INT DEFAULT 0,
  estimated_duration INT DEFAULT 0,
  template TEXT DEFAULT 'tool-review',
  style TEXT DEFAULT 'educational',
  language TEXT DEFAULT 'en',
  status TEXT DEFAULT 'draft',
  version INT DEFAULT 1,
  critic_score JSONB,
  critic_feedback TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Script Versions
CREATE TABLE script_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  script_id UUID REFERENCES scripts(id) ON DELETE CASCADE,
  version INT NOT NULL,
  full_script TEXT NOT NULL,
  hook TEXT DEFAULT '',
  body TEXT DEFAULT '',
  cta TEXT DEFAULT '',
  changes_summary TEXT DEFAULT '',
  edited_by TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Editor Briefs
CREATE TABLE editor_briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  script_id UUID REFERENCES scripts(id),
  channel_id TEXT REFERENCES channels(id),
  scenes JSONB DEFAULT '[]',
  music_mood TEXT DEFAULT '',
  music_suggestions JSONB DEFAULT '[]',
  thumbnail_concepts JSONB DEFAULT '[]',
  caption TEXT DEFAULT '',
  hashtags TEXT[] DEFAULT '{}',
  first_comment TEXT DEFAULT '',
  reference_videos JSONB DEFAULT '[]',
  editor_notes TEXT DEFAULT '',
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- CTAs
CREATE TABLE ctas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  script_id UUID REFERENCES scripts(id),
  cta_type TEXT DEFAULT 'comment',
  trigger_text TEXT DEFAULT '',
  trigger_keyword TEXT DEFAULT '',
  freebie_type TEXT,
  freebie_title TEXT DEFAULT '',
  freebie_content TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Calendar Entries
CREATE TABLE calendar_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id TEXT REFERENCES channels(id),
  idea_id UUID REFERENCES ideas(id),
  script_id UUID REFERENCES scripts(id),
  brief_id UUID REFERENCES editor_briefs(id),
  scheduled_date DATE NOT NULL,
  scheduled_time TIME,
  status TEXT DEFAULT 'planned',
  posted_at TIMESTAMPTZ,
  post_url TEXT,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Competitors
CREATE TABLE competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT DEFAULT 'instagram',
  handle TEXT NOT NULL,
  name TEXT DEFAULT '',
  follower_count INT DEFAULT 0,
  category TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  last_scraped_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Scraped Posts
CREATE TABLE scraped_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competitor_id UUID REFERENCES competitors(id) ON DELETE CASCADE,
  post_id TEXT UNIQUE,
  post_type TEXT DEFAULT 'reel',
  caption TEXT DEFAULT '',
  hashtags TEXT[] DEFAULT '{}',
  likes INT DEFAULT 0,
  comments INT DEFAULT 0,
  views INT DEFAULT 0,
  shares INT DEFAULT 0,
  engagement_rate DECIMAL(6,4) DEFAULT 0,
  posted_at TIMESTAMPTZ,
  media_url TEXT DEFAULT '',
  is_viral BOOLEAN DEFAULT false,
  analysis JSONB DEFAULT '{}',
  scraped_at TIMESTAMPTZ DEFAULT now()
);

-- Trend Reports
CREATE TABLE trend_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type TEXT DEFAULT 'daily',
  sources JSONB DEFAULT '[]',
  trends JSONB DEFAULT '[]',
  ideas_generated JSONB DEFAULT '[]',
  summary TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Voice Profiles
CREATE TABLE voice_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id TEXT REFERENCES channels(id) ON DELETE CASCADE,
  energy TEXT DEFAULT 'high',
  formality DECIMAL(3,2) DEFAULT 0.40,
  humor_frequency DECIMAL(3,2) DEFAULT 0.30,
  hook_style TEXT DEFAULT 'question_or_bold_claim',
  signature_phrases TEXT[] DEFAULT '{}',
  avoid_phrases TEXT[] DEFAULT '{}',
  sentence_length TEXT DEFAULT 'short_to_medium',
  cta_style TEXT DEFAULT 'value_first',
  storytelling BOOLEAN DEFAULT true,
  example_scripts TEXT[] DEFAULT '{}',
  training_video_count INT DEFAULT 0,
  voice_match_score DECIMAL(4,2) DEFAULT 0,
  last_trained_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Agent Runs
CREATE TABLE agent_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline TEXT DEFAULT '',
  agents_involved TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'running',
  input JSONB DEFAULT '{}',
  output JSONB DEFAULT '{}',
  steps JSONB DEFAULT '[]',
  total_tokens INT DEFAULT 0,
  total_cost DECIMAL(10,4) DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_ideas_channel ON ideas(channel_id);
CREATE INDEX idx_ideas_status ON ideas(status);
CREATE INDEX idx_scripts_channel ON scripts(channel_id);
CREATE INDEX idx_scripts_status ON scripts(status);
CREATE INDEX idx_calendar_date ON calendar_entries(scheduled_date);
CREATE INDEX idx_scraped_posts_competitor ON scraped_posts(competitor_id);
CREATE INDEX idx_scraped_posts_viral ON scraped_posts(is_viral) WHERE is_viral = true;

-- Seed Alex's 3 channels
INSERT INTO channels (id, name, handle, language, audience_size, editor_type, color, avatar_mode, content_pillars) VALUES
  ('innov8ai', 'Innov8 AI', '@innov8.ai', 'en', 92000, 'external', '#3B82F6', false, '["AI tools", "tutorials", "trends"]'),
  ('alextom', 'Alex Tom AI', '@alextom.ai', 'en', 0, 'external', '#8B5CF6', false, '["personal brand", "founder journey", "raw takes"]'),
  ('academy', 'Innov8 Academy', '@innov8.academy', 'ml', 0, 'self', '#10B981', true, '["AI avatars", "tutorials", "Malayalam"]');

-- Enable RLS but allow all for now (single user)
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE editor_briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraped_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE trend_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE script_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ctas ENABLE ROW LEVEL SECURITY;

-- Policies: allow everything for anon (single user, no auth yet)
CREATE POLICY "Allow all" ON channels FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON ideas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON scripts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON editor_briefs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON calendar_entries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON competitors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON scraped_posts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON trend_reports FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON voice_profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON agent_runs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON script_versions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON ctas FOR ALL USING (true) WITH CHECK (true);
