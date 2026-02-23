import type { ChannelId, AgentId, PipelineStatus } from './constants';

export interface Channel {
  id: string;
  userId: string;
  name: string;
  handle: string;
  platform: string;
  language: string;
  audienceSize: number;
  contentPillars: string[];
  toneGuide: string;
  postingSchedule: Record<string, boolean>;
  avatarMode: boolean;
  editorType: 'external' | 'self';
  color: string;
  createdAt: string;
}

export interface Idea {
  id: string;
  userId: string;
  channelId: string;
  title: string;
  description: string;
  angle: string;
  hooks: string[];
  format: 'reel' | 'carousel' | 'story' | 'youtube';
  tags: string[];
  status: 'raw' | 'developed' | 'scripted' | 'used' | 'archived';
  priority: number;
  viralityScore: number;
  targetAudience: string;
  keyPoints: string[];
  ctaStrategy: string;
  references: { url: string; note: string }[];
  source: 'manual' | 'scout' | 'trend-scanner';
  createdAt: string;
  updatedAt: string;
}

export interface Script {
  id: string;
  ideaId: string;
  userId: string;
  channelId: string;
  title: string;
  hook: string;
  hookVariations: string[];
  body: string;
  cta: string;
  outro: string;
  fullScript: string;
  visualCues: { timestamp: string; visual: string; textOverlay: string }[];
  speakerNotes: string;
  wordCount: number;
  estimatedDuration: number;
  template: string;
  style: string;
  language: string;
  status: 'draft' | 'review' | 'approved' | 'recorded' | 'posted';
  version: number;
  criticScore: {
    hook: number;
    voice: number;
    value: number;
    cta: number;
    overall: number;
  } | null;
  criticFeedback: string;
  createdAt: string;
  updatedAt: string;
}

export interface EditorBrief {
  id: string;
  scriptId: string;
  userId: string;
  channelId: string;
  scenes: {
    sceneNum: number;
    narration: string;
    visual: string;
    textOverlay: string;
    broll: string;
    transition: string;
    duration: number;
  }[];
  musicMood: string;
  musicSuggestions: string[];
  thumbnailConcepts: { concept: string; text: string; style: string }[];
  caption: string;
  hashtags: string[];
  referenceVideos: { url: string; note: string }[];
  editorNotes: string;
  status: 'draft' | 'sent' | 'completed';
  createdAt: string;
}

export interface CalendarEntry {
  id: string;
  userId: string;
  channelId: string;
  ideaId?: string;
  scriptId?: string;
  briefId?: string;
  scheduledDate: string;
  status: PipelineStatus;
  postedAt?: string;
  postUrl?: string;
  createdAt: string;
}

export interface AgentRun {
  id: string;
  userId: string;
  pipeline: string;
  agentsInvolved: AgentId[];
  status: 'running' | 'completed' | 'failed';
  steps: {
    agent: AgentId;
    action: string;
    started: string;
    completed?: string;
    result?: string;
  }[];
  totalTokens: number;
  totalCost: number;
  startedAt: string;
  completedAt?: string;
}

export interface TrendReport {
  id: string;
  reportType: 'daily' | 'weekly' | 'on-demand';
  sources: string[];
  trends: {
    topic: string;
    source: string;
    score: number;
    data: Record<string, unknown>;
  }[];
  summary: string;
  createdAt: string;
}

export interface VoiceProfile {
  id: string;
  channelId: string;
  energy: 'low' | 'medium' | 'high';
  formality: number;
  humorFrequency: number;
  hookStyle: string;
  signaturePhrases: string[];
  avoidPhrases: string[];
  sentenceLength: string;
  ctaStyle: string;
  storytelling: boolean;
  trainingVideoCount: number;
  voiceMatchScore: number;
  lastTrainedAt?: string;
}

export interface AgentMessage {
  id: string;
  agentId: AgentId;
  content: string;
  timestamp: string;
  type: 'message' | 'artifact' | 'decision' | 'progress';
  artifacts?: {
    type: 'idea' | 'script' | 'brief' | 'trend';
    data: Record<string, unknown>;
  }[];
  progress?: number;
}
