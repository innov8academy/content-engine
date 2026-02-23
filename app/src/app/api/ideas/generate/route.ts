import { NextRequest, NextResponse } from 'next/server';
import { chatCompletion } from '@/lib/openrouter';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { channelId, topic, count = 5 } = await req.json();

    // Get channel info
    const { data: channel } = await supabase
      .from('channels')
      .select('*')
      .eq('id', channelId)
      .single();

    if (!channel) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
    }

    const systemPrompt = `You are Scout, an AI content research agent. You generate viral content ideas for Instagram creators.

Channel: ${channel.name} (${channel.handle})
Language: ${channel.language === 'ml' ? 'Malayalam' : 'English'}
Audience: ${channel.audience_size?.toLocaleString() || 'Growing'} followers
Content Pillars: ${JSON.stringify(channel.content_pillars)}
Platform: Instagram Reels

Generate ${count} content ideas. For each idea, provide:
- title: A compelling title (not the hook — the concept)
- description: 2-3 sentences explaining the content
- angle: The unique angle or perspective
- hooks: Array of 3 hook options (first 3 seconds of video)
- format: "reel" or "carousel"
- tags: Array of relevant tags
- priority: 1-10 score
- virality_score: 1-100 predicted virality
- target_audience: Who specifically this is for
- key_points: Array of 3-5 main points to cover
- cta_strategy: Suggested call to action

${topic ? `Focus on this topic/area: ${topic}` : 'Generate diverse ideas across the content pillars.'}

Respond with valid JSON: { "ideas": [...] }`;

    const result = await chatCompletion(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate ${count} content ideas for ${channel.handle}${topic ? ` about "${topic}"` : ''}.` },
      ],
      'idea-generation',
      { temperature: 0.8 }
    );

    // Parse the JSON from the response
    const jsonMatch = (result as string).match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const ideas = parsed.ideas || [];

    // Save to Supabase
    const savedIdeas = [];
    for (const idea of ideas) {
      const { data, error } = await supabase
        .from('ideas')
        .insert({
          channel_id: channelId,
          title: idea.title,
          description: idea.description,
          angle: idea.angle,
          hooks: idea.hooks,
          format: idea.format || 'reel',
          tags: idea.tags || [],
          status: 'raw',
          priority: idea.priority || 5,
          virality_score: idea.virality_score || 50,
          target_audience: idea.target_audience || '',
          key_points: idea.key_points || [],
          cta_strategy: idea.cta_strategy || '',
          source: 'scout',
        })
        .select()
        .single();

      if (data) savedIdeas.push(data);
    }

    return NextResponse.json({ ideas: savedIdeas, count: savedIdeas.length });
  } catch (error: unknown) {
    console.error('Idea generation error:', error);
    return NextResponse.json({ error: 'Failed to generate ideas' }, { status: 500 });
  }
}
