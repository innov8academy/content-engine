import { NextRequest, NextResponse } from 'next/server';
import { chatCompletion } from '@/lib/openrouter';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const { data: script } = await supabase
      .from('scripts')
      .select('*, channels(*)')
      .eq('id', id)
      .single();

    if (!script) {
      return NextResponse.json({ error: 'Script not found' }, { status: 404 });
    }

    const systemPrompt = `You are Critic, a brutally honest content quality reviewer. Score this Instagram Reel script.

Score each dimension 1-10:
- hook: Does it stop the scroll in <3 seconds?
- voice: Does it sound natural, not AI-generated?
- value: Is every second earning attention?
- cta: Will people actually act on it?

Then give specific, actionable feedback. Be direct. No fluff.

Respond with JSON:
{
  "critic_score": { "hook": 8, "voice": 7, "value": 9, "cta": 6, "overall": 7.5 },
  "critic_feedback": "Specific feedback here..."
}`;

    const fullScript = `HOOK: ${script.hook}\n\nBODY: ${script.body}\n\nCTA: ${script.cta}`;

    const result = await chatCompletion(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Review this script for ${(script as Record<string, unknown>).channels ? ((script as Record<string, unknown>).channels as Record<string, unknown>).handle : 'unknown'}:\n\n${fullScript}` },
      ],
      'critic-review',
      { temperature: 0.3 }
    );

    const jsonMatch = (result as string).match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Failed to parse review' }, { status: 500 });
    }

    const review = JSON.parse(jsonMatch[0]);

    const { data: updated, error } = await supabase
      .from('scripts')
      .update({
        critic_score: review.critic_score,
        critic_feedback: review.critic_feedback,
        status: 'review',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ script: updated, review });
  } catch (error: unknown) {
    console.error('Critic review error:', error);
    return NextResponse.json({ error: 'Failed to review script' }, { status: 500 });
  }
}
