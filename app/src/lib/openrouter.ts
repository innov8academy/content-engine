const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!;
const BASE_URL = 'https://openrouter.ai/api/v1';

export type ModelId =
  | 'anthropic/claude-sonnet-4'
  | 'anthropic/claude-haiku-4'
  | 'openai/gpt-4o'
  | 'openai/gpt-4o-mini'
  | 'google/gemini-2.0-flash-001'
  | 'google/gemini-2.5-pro-preview';

// Best model for each task
export const MODEL_MAP = {
  'idea-generation': 'anthropic/claude-sonnet-4' as ModelId,
  'idea-development': 'anthropic/claude-sonnet-4' as ModelId,
  'script-generation': 'anthropic/claude-sonnet-4' as ModelId,
  'script-refinement': 'openai/gpt-4o' as ModelId,
  'hook-generation': 'anthropic/claude-sonnet-4' as ModelId,
  'critic-review': 'anthropic/claude-sonnet-4' as ModelId,
  'brief-generation': 'openai/gpt-4o' as ModelId,
  'malayalam': 'google/gemini-2.5-pro-preview' as ModelId,
  'trend-analysis': 'openai/gpt-4o-mini' as ModelId,
  'quick': 'openai/gpt-4o-mini' as ModelId,
};

export type TaskType = keyof typeof MODEL_MAP;

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function chatCompletion(
  messages: ChatMessage[],
  task: TaskType = 'quick',
  options?: { model?: ModelId; temperature?: number; maxTokens?: number; stream?: boolean }
) {
  const model = options?.model || MODEL_MAP[task];

  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://content-engine.vercel.app',
      'X-Title': 'Content Engine',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 4096,
      stream: options?.stream ?? false,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter error: ${response.status} — ${error}`);
  }

  if (options?.stream) {
    return response;
  }

  const data = await response.json();
  return data.choices[0].message.content as string;
}

export async function streamCompletion(
  messages: ChatMessage[],
  task: TaskType = 'quick',
  options?: { model?: ModelId; temperature?: number; maxTokens?: number }
) {
  const response = await chatCompletion(messages, task, { ...options, stream: true });
  return response as Response;
}
