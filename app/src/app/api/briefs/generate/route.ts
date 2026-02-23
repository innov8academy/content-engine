import { NextRequest, NextResponse } from 'next/server';
import { chatCompletion } from '@/lib/openrouter';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { scriptId } = await req.json();

    const { data: script } = await supabase
      .from('scripts')
      .select('*, channels(*)')
      .eq('id', scriptId)
      .single();

    if (!script) {
      return NextResponse.json({ error: 'Script not found' }, { status: 404 });
    }

    const systemPrompt = `You are Editor, an AI that creates complete editing briefs for video editors.

From this script, create a detailed editing document with:
- Scene-by-scene breakdown
- B-roll suggestions with search terms
- Text overlay content and timing
- Music mood and specific suggestions
- Thumbnail concepts (3 options)
- Caption for the post
- Hashtags (8-12 relevant ones)
- Editor notes

Respond with JSON:
{
  "scenes": [{"sceneNum": 1, "narration": "...", "visual": "...", "textOverlay": "...", "broll": "...", "transition": "...", "duration": 3}],
  "music_mood": "Tech/electronic, medium energy",
  "music_suggestions": ["Epidemic Sound - Track Name"],
  "thumbnail_concepts": [{"concept": "...", "text": "...", "style": "..."}],
  "caption": "Full Instagram caption with emojis",
  "hashtags": ["#AI", "#tech"],
  "editor_notes": "General editing instructions"
}`;

    const fullScript = `TITLE: ${script.title}\nHOOK: ${script.hook}\nBODY: ${script.body}\nCTA: ${script.cta}`;

    const result = await chatCompletion(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Create an editor brief for this script:\n\n${fullScript}` },
      ],
      'brief-generation',
      { temperature: 0.5, maxTokens: 4096 }
    );

    const jsonMatch = (result as string).match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Failed to parse brief' }, { status: 500 });
    }

    const briefData = JSON.parse(jsonMatch[0]);

    const { data: brief, error } = await supabase
      .from('editor_briefs')
      .insert({
        script_id: scriptId,
        channel_id: script.channel_id,
        scenes: briefData.scenes || [],
        music_mood: briefData.music_mood || '',
        music_suggestions: briefData.music_suggestions || [],
        thumbnail_concepts: briefData.thumbnail_concepts || [],
        caption: briefData.caption || '',
        hashtags: briefData.hashtags || [],
        editor_notes: briefData.editor_notes || '',
        status: 'draft',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ brief });
  } catch (error: unknown) {
    console.error('Brief generation error:', error);
    return NextResponse.json({ error: 'Failed to generate brief' }, { status: 500 });
  }
}
