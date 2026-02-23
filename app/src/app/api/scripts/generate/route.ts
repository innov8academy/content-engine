import { NextRequest, NextResponse } from 'next/server';
import { chatCompletion } from '@/lib/openrouter';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { ideaId, template = 'tool-review', style = 'educational' } = await req.json();

    // Get idea + channel
    const { data: idea } = await supabase
      .from('ideas')
      .select('*, channels(*)')
      .eq('id', ideaId)
      .single();

    if (!idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }

    const channel = (idea as Record<string, unknown>).channels as Record<string, unknown>;
    const isMLLanguage = channel?.language === 'ml';

    const systemPrompt = `You are Writer, an expert AI content scriptwriter. You write viral Instagram Reel scripts.

Channel: ${channel?.name} (${channel?.handle})
Language: ${isMLLanguage ? 'Malayalam (Kerala colloquial, not formal)' : 'English'}
Style: ${style}
Template: ${template}

SCRIPT TEMPLATES:
- tool-review: Hook → Problem → Tool Demo → Results → CTA
- tutorial: Hook → What We'll Build → Steps → Result → CTA
- hot-take: Controversial Hook → Context → Opinion → Proof → CTA
- story: Hook → Setup → Conflict → Resolution → Lesson → CTA
- listicle: Hook → Item 1-5 → Best Pick → CTA
- comparison: Hook → Tool A → Tool B → Key Differences → Winner → CTA

RULES:
- Hook must stop the scroll in <3 seconds
- Keep total script under 60 seconds (200-250 words)
- Every sentence must earn attention
- CTA should offer genuine value
- Visual cues for every section
- Be conversational, not robotic
${isMLLanguage ? '- Write in natural Kerala Malayalam, not translated English' : ''}

IDEA TO SCRIPT:
Title: ${idea.title}
Description: ${idea.description}
Angle: ${idea.angle}
Key Points: ${JSON.stringify(idea.key_points)}
CTA Strategy: ${idea.cta_strategy}

Respond with valid JSON:
{
  "hook": "The main hook line",
  "hook_variations": ["alt1", "alt2", "alt3"],
  "body": "The main script body",
  "cta": "Call to action text",
  "outro": "Sign-off line",
  "visual_cues": [{"timestamp": "0:00-0:03", "visual": "...", "textOverlay": "..."}],
  "speaker_notes": "Delivery notes",
  "word_count": 234,
  "estimated_duration": 58
}`;

    const result = await chatCompletion(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Write a ${template} script for: "${idea.title}"` },
      ],
      isMLLanguage ? 'malayalam' : 'script-generation',
      { temperature: 0.7, maxTokens: 4096 }
    );

    const jsonMatch = (result as string).match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    const scriptData = JSON.parse(jsonMatch[0]);

    // Save to Supabase
    const { data: script, error } = await supabase
      .from('scripts')
      .insert({
        idea_id: ideaId,
        channel_id: idea.channel_id,
        title: idea.title,
        hook: scriptData.hook,
        hook_variations: scriptData.hook_variations || [],
        body: scriptData.body,
        cta: scriptData.cta,
        outro: scriptData.outro || '',
        full_script: `${scriptData.hook}\n\n${scriptData.body}\n\n${scriptData.cta}`,
        visual_cues: scriptData.visual_cues || [],
        speaker_notes: scriptData.speaker_notes || '',
        word_count: scriptData.word_count || 0,
        estimated_duration: scriptData.estimated_duration || 60,
        template,
        style,
        language: channel?.language || 'en',
        status: 'draft',
        version: 1,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Update idea status
    await supabase
      .from('ideas')
      .update({ status: 'scripted', updated_at: new Date().toISOString() })
      .eq('id', ideaId);

    return NextResponse.json({ script });
  } catch (error: unknown) {
    console.error('Script generation error:', error);
    return NextResponse.json({ error: 'Failed to generate script' }, { status: 500 });
  }
}
