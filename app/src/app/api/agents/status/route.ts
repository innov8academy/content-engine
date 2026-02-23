import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET all agent statuses
export async function GET() {
  const { data, error } = await supabase
    .from('agent_status')
    .select('*')
    .order('agent_id');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

// PATCH update agent status
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { agent_id, status, current_task, detail, metric, progress } = body;

  if (!agent_id) {
    return NextResponse.json({ error: 'agent_id required' }, { status: 400 });
  }

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (status !== undefined) update.status = status;
  if (current_task !== undefined) update.current_task = current_task;
  if (detail !== undefined) update.detail = detail;
  if (metric !== undefined) update.metric = metric;
  if (progress !== undefined) update.progress = progress;
  if (status === 'active') update.last_active_at = new Date().toISOString();

  const { data, error } = await supabase
    .from('agent_status')
    .update(update)
    .eq('agent_id', agent_id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
