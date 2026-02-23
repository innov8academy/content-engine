import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST() {
  // Try to insert seed data for agent_status via REST
  // Tables must be created via Supabase SQL editor first
  const agents = [
    { agent_id: 'scout', status: 'idle', detail: 'Awaiting orders', metric: '0 scans today', progress: 0, current_task: '' },
    { agent_id: 'voice', status: 'idle', detail: 'Ready', metric: 'No profiles trained', progress: 0, current_task: '' },
    { agent_id: 'writer', status: 'idle', detail: 'No scripts in queue', metric: '0 drafts today', progress: 0, current_task: '' },
    { agent_id: 'editor', status: 'idle', detail: 'No briefs pending', metric: '0 briefs today', progress: 0, current_task: '' },
    { agent_id: 'critic', status: 'idle', detail: 'Waiting for content', metric: '0 reviews today', progress: 0, current_task: '' },
    { agent_id: 'calendar', status: 'idle', detail: 'Schedule clear', metric: 'This week: 0/3', progress: 0, current_task: '' },
  ];

  const { data, error } = await supabase
    .from('agent_status')
    .upsert(agents, { onConflict: 'agent_id' })
    .select();

  if (error) {
    return NextResponse.json({ error: error.message, hint: 'Run the SQL in Supabase dashboard first' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, agents: data });
}
