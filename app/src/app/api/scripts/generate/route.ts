import { NextRequest, NextResponse } from 'next/server';
import { chatCompletion } from '@/lib/openrouter';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { ideaId, template = 'tool-review', style = 'educational' } = await req.json();

    // Get idea + channel
    const { data: idea } = await supabase
      .from('ideas')
      .select('*')
      .eq('id', ideaId)
      .single();

    if (!idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }

    const { data: channel } = await supabase
      .from('channels')
      .select('*')
      .eq('id', idea.channel_id)
      .single();

    if (!channel) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
    }

    const isML = channel.language === 'ml';

    // FC v2 HPR Script Structure merged with Content Engine templates
    const systemPrompt = `You are Writer, an expert scriptwriter for Instagram Reels. You write scripts that STOP THE SCROLL and sound like a real human, not AI.

CHANNEL: ${channel.name} (${channel.handle})
LANGUAGE: ${isML ? 'Malayalam (Kerala colloquial — NOT formal Malayalam, NOT translated English. Real spoken Malayalam as used in everyday conversation.)' : 'English'}
STYLE: ${style}
TEMPLATE: ${template}

## SCRIPT STRUCTURE (HPR — Hook-Problem-Resolution)
Every script follows this 6-block structure with timestamps:

[0:00-0:05] HOOK — Stop the scroll. Create instant curiosity. Use one of these patterns:
  - Statistic/Data-Shock: "X% of Y struggle with Z"
  - Pain-Question: "Why do most X fail at Y?"
  - Negative-Promise: "Stop doing X—here's why"
  - Myth-Buster: "Everyone believes X, but actually Y"
  - Trend-Window: "X is changing—here's what to do"

[0:05-0:20] PROBLEM — Make them feel understood. Describe their pain specifically.

[0:20-0:35] PROOF — Build credibility. Use specific data, case studies, real examples.

[0:35-0:50] SOLUTION — Give them the answer. Be concrete and actionable.

[0:50-0:55] WHAT-IT-MEANS — Make it personal. One line that hits emotionally.

[0:55-1:00] CTA — Tell them exactly what to do. Offer value (not "like and subscribe").

## TEMPLATE VARIATIONS
- tool-review: Hook (bold claim about tool) → Problem (old way sucks) → Demo → Results → CTA
- tutorial: Hook (end result tease) → Problem → Step-by-step → Final result → CTA
- hot-take: Controversial hook → Context everyone misses → Your opinion with proof → CTA
- story: Personal hook → Setup → Conflict/Discovery → Resolution → Lesson → CTA
- comparison: Hook (unexpected winner) → Tool A → Tool B → Key differences → Verdict → CTA
- listicle: Hook (number + benefit) → Items with proof → Best pick → CTA

## RULES
1. Total: 200-250 words MAX (under 60 seconds)
2. Every sentence EARNS attention or gets CUT
3. No filler: "In this video", "Don't forget to", "Hey guys"
4. Specific > Generic: Name real tools, real numbers, real people
5. The hook must work in TEXT (it's what they read while scrolling)
6. CTA must offer genuine value — freebie, guide, template
7. Include visual cues for EVERY section (what's on screen)
${isML ? '8. Write in natural Kerala Malayalam. Use spoken Malayalam, not textbook. Mix English tech terms naturally.' : ''}

## IDEA TO SCRIPT
Title: ${idea.title}
Description: ${idea.description}
Angle: ${idea.angle || 'No specific angle provided'}
Key Points: ${JSON.stringify(idea.key_points || [])}
CTA Strategy: ${idea.cta_strategy || 'Value-driven CTA'}
Hooks already suggested: ${JSON.stringify((idea.hooks || []).slice(0, 3))}

Respond with valid JSON:
{
  "hook": "The main hook (0:00-0:05)",
  "hook_variations": ["alt hook 1", "alt hook 2", "alt hook 3"],
  "body": "The full script body (PROBLEM + PROOF + SOLUTION + WHAT-IT-MEANS sections combined, with section markers)",
  "cta": "Call to action (0:55-1:00)",
  "outro": "Sign-off line",
  "visual_cues": [
    {"timestamp": "0:00-0:05", "visual": "description of what viewer sees", "textOverlay": "text on screen"},
    {"timestamp": "0:05-0:20", "visual": "...", "textOverlay": "..."},
    {"timestamp": "0:20-0:35", "visual": "...", "textOverlay": "..."},
    {"timestamp": "0:35-0:50", "visual": "...", "textOverlay": "..."},
    {"timestamp": "0:50-0:55", "visual": "...", "textOverlay": "..."},
    {"timestamp": "0:55-1:00", "visual": "...", "textOverlay": "..."}
  ],
  "speaker_notes": "Delivery tips: energy level, pace changes, emphasis points",
  "word_count": 234,
  "estimated_duration": 58
}`;

    const result = await chatCompletion(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Write a ${template} style ${style} script for: "${idea.title}"\n\nUse the angle: ${idea.angle || 'best angle for virality'}` },
      ],
      isML ? 'malayalam' : 'script-generation',
      { temperature: 0.7, maxTokens: 4096 }
    );

    const jsonMatch = (result as string).match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    const scriptData = JSON.parse(jsonMatch[0]);

    const fullScript = [scriptData.hook, scriptData.body, scriptData.cta].filter(Boolean).join('\n\n');
    const wordCount = fullScript.split(/\s+/).length;

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
        full_script: fullScript,
        visual_cues: scriptData.visual_cues || [],
        speaker_notes: scriptData.speaker_notes || '',
        word_count: wordCount,
        estimated_duration: scriptData.estimated_duration || Math.round(wordCount / 4),
        template,
        style,
        language: channel.language || 'en',
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
