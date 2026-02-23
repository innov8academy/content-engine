import { NextRequest, NextResponse } from 'next/server';
import { chatCompletion } from '@/lib/openrouter';
import { supabase } from '@/lib/supabase';

async function searchWeb(query: string): Promise<string> {
  try {
    // Try Brave Search first
    if (process.env.BRAVE_API_KEY) {
      const res = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=10&freshness=pw`, {
        headers: { 'X-Subscription-Token': process.env.BRAVE_API_KEY },
      });
      if (res.ok) {
        const data = await res.json();
        return (data.web?.results || [])
          .map((r: { title: string; description: string; url: string }) => `- ${r.title}: ${r.description} (${r.url})`)
          .join('\n');
      }
    }

    // Fallback: Use Apify Google Search scraper
    const apiKey = process.env.APIFY_API_KEY;
    if (!apiKey) return '';

    const res = await fetch(`https://api.apify.com/v2/acts/apify~google-search-scraper/run-sync-get-dataset-items?token=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        queries: query,
        maxPagesPerQuery: 1,
        resultsPerPage: 10,
      }),
    });
    if (!res.ok) return '';
    const results = await res.json();
    return results
      .slice(0, 10)
      .map((r: { title: string; description: string; url: string }) => `- ${r.title}: ${r.description} (${r.url})`)
      .join('\n');
  } catch { return ''; }
}

async function scrapeInstagramCompetitors(): Promise<string> {
  try {
    const apiKey = process.env.APIFY_API_KEY;
    if (!apiKey) return '';

    // Use Apify Instagram scraper for AI content creators
    const handles = ['aiaboratory', 'theaisolopreneur', 'ai.tools.daily', 'mattvidpro'];
    const results: string[] = [];

    for (const handle of handles.slice(0, 2)) {
      const res = await fetch(`https://api.apify.com/v2/acts/apify~instagram-post-scraper/run-sync-get-dataset-items?token=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          directUrls: [`https://www.instagram.com/${handle}/`],
          resultsLimit: 5,
        }),
      });
      if (res.ok) {
        const posts = await res.json();
        for (const post of posts.slice(0, 3)) {
          results.push(`@${handle}: "${(post.caption || '').slice(0, 200)}" — ${post.likesCount || 0} likes, ${post.commentsCount || 0} comments`);
        }
      }
    }
    return results.join('\n');
  } catch { return ''; }
}

async function searchTwitterTrends(): Promise<string> {
  return searchWeb('site:x.com OR site:twitter.com AI tools trending new 2026');
}

async function searchRedditHN(): Promise<string> {
  return searchWeb('site:reddit.com OR site:news.ycombinator.com AI tools new launch trending');
}

async function searchProductHunt(): Promise<string> {
  return searchWeb('site:producthunt.com AI tool launched new');
}

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

    // === REAL RESEARCH PHASE ===
    const searchQuery = topic || 'AI tools trending new launch';

    // Run all research in parallel
    const [webResults, instagramData, twitterData, redditData, phData] = await Promise.allSettled([
      searchWeb(`${searchQuery} ${new Date().toISOString().slice(0, 7)}`),
      scrapeInstagramCompetitors(),
      searchTwitterTrends(),
      searchRedditHN(),
      searchProductHunt(),
    ]).then(results => results.map(r => r.status === 'fulfilled' ? r.value : ''));

    const researchContext = `
=== REAL-TIME RESEARCH DATA (${new Date().toISOString()}) ===

📰 WEB SEARCH RESULTS:
${webResults || 'No results available'}

📸 INSTAGRAM COMPETITOR POSTS (what\'s getting engagement):
${instagramData || 'Scraping unavailable — generate ideas from web data'}

🐦 TWITTER/X AI TRENDS:
${twitterData || 'No results available'}

📱 REDDIT & HACKER NEWS:
${redditData || 'No results available'}

🚀 PRODUCT HUNT NEW LAUNCHES:
${phData || 'No results available'}
`;

    const systemPrompt = `You are Scout, an AI content research agent. You generate viral content ideas based on REAL trend data.

Channel: ${channel.name} (${channel.handle})
Language: ${channel.language === 'ml' ? 'Malayalam' : 'English'}
Audience: ${channel.audience_size?.toLocaleString() || 'Growing'} followers
Content Pillars: ${JSON.stringify(channel.content_pillars)}
Platform: Instagram Reels

CRITICAL RULES:
- ONLY suggest ideas based on the research data below
- Every idea must reference a REAL tool, trend, or event from the data
- No generic "Top 5 AI Tools" garbage — be SPECIFIC
- Include the source/evidence for why this idea will work
- If a competitor already covered something, find the GAP they missed
- Prioritize ideas that are timely (trending NOW, not evergreen fluff)

${researchContext}

Generate ${count} content ideas. For each idea, provide:
- title: Specific, compelling (reference the actual tool/trend)
- description: 2-3 sentences with real context from research
- angle: The unique angle competitors haven't covered
- hooks: Array of 3 scroll-stopping hooks
- format: "reel" or "carousel"
- tags: Relevant tags
- priority: 1-10 (based on trend freshness + audience fit)
- virality_score: 1-100 (based on competitor engagement data)
- target_audience: Specific audience segment
- key_points: 3-5 main points backed by research
- cta_strategy: Value-driven CTA

${topic ? `Focus area: ${topic}` : 'Cover the most interesting trends from the research.'}

Respond with valid JSON: { "ideas": [...] }`;

    const result = await chatCompletion(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Based on the real-time research data, generate ${count} content ideas for ${channel.handle}${topic ? ` about "${topic}"` : ''}.` },
      ],
      'idea-generation',
      { temperature: 0.7, maxTokens: 8192 }
    );

    // Parse the JSON
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
          source_data: { research: researchContext.slice(0, 2000) },
        })
        .select()
        .single();

      if (data) savedIdeas.push(data);
    }

    return NextResponse.json({
      ideas: savedIdeas,
      count: savedIdeas.length,
      research: {
        web: !!webResults,
        instagram: !!instagramData,
        twitter: !!twitterData,
        reddit: !!redditData,
        producthunt: !!phData,
      }
    });
  } catch (error: unknown) {
    console.error('Idea generation error:', error);
    return NextResponse.json({ error: 'Failed to generate ideas' }, { status: 500 });
  }
}
