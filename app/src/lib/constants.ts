// Channel definitions
export const CHANNELS = {
  innov8ai: {
    id: 'innov8ai',
    name: 'Innov8 AI',
    handle: '@innov8.ai',
    color: '#3B82F6',
    bgColor: 'bg-blue-500',
    textColor: 'text-blue-500',
    language: 'en',
    editor: 'external',
    avatarMode: false,
  },
  alextom: {
    id: 'alextom',
    name: 'Alex Tom AI',
    handle: '@alextom.ai',
    color: '#8B5CF6',
    bgColor: 'bg-violet-500',
    textColor: 'text-violet-500',
    language: 'en',
    editor: 'external',
    avatarMode: false,
  },
  academy: {
    id: 'academy',
    name: 'Innov8 Academy',
    handle: '@innov8.academy',
    color: '#10B981',
    bgColor: 'bg-emerald-500',
    textColor: 'text-emerald-500',
    language: 'ml',
    editor: 'self',
    avatarMode: true,
  },
} as const;

export type ChannelId = keyof typeof CHANNELS;

// Agent definitions
export const AGENTS = {
  scout: {
    id: 'scout',
    name: 'Scout',
    emoji: '🔍',
    color: '#F59E0B',
    role: 'Research & Intelligence',
    description: 'Scans the internet for content opportunities',
  },
  voice: {
    id: 'voice',
    name: 'Voice',
    emoji: '🎙️',
    color: '#EC4899',
    role: 'Style & Tone Engine',
    description: 'Learns and maintains your unique voice',
  },
  writer: {
    id: 'writer',
    name: 'Writer',
    emoji: '✍️',
    color: '#3B82F6',
    role: 'Script Generation',
    description: 'Produces near-final scripts in your voice',
  },
  editor: {
    id: 'editor',
    name: 'Editor',
    emoji: '📋',
    color: '#8B5CF6',
    role: 'Production Briefs',
    description: 'Creates complete editing documents',
  },
  critic: {
    id: 'critic',
    name: 'Critic',
    emoji: '🎯',
    color: '#EF4444',
    role: 'Quality Control',
    description: 'Reviews everything before you see it',
  },
  calendar: {
    id: 'calendar',
    name: 'Calendar',
    emoji: '📅',
    color: '#10B981',
    role: 'Scheduling & Automation',
    description: 'Manages pipeline and keeps you on track',
  },
} as const;

export type AgentId = keyof typeof AGENTS;

// Pipeline statuses
export const PIPELINE_STATUSES = [
  'idea',
  'developing',
  'scripted',
  'approved',
  'recording',
  'editing',
  'posted',
] as const;

export type PipelineStatus = (typeof PIPELINE_STATUSES)[number];

// Script templates
export const SCRIPT_TEMPLATES = [
  { id: 'tool-review', name: 'Tool Review', icon: '🔧' },
  { id: 'tutorial', name: 'Tutorial', icon: '📚' },
  { id: 'hot-take', name: 'Hot Take', icon: '🔥' },
  { id: 'story', name: 'Story', icon: '📖' },
  { id: 'listicle', name: 'Listicle', icon: '📋' },
  { id: 'comparison', name: 'Comparison', icon: '⚖️' },
  { id: 'bts', name: 'Behind the Scenes', icon: '🎬' },
] as const;
