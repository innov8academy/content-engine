import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET recent agent logs
export async function GET(req: NextRequest) {
  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '20');

  const { data, error } = await supabase
    .from('agent_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

// POST new log entry
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { agent_id, action, detail, metadata } = body;

  if (!agent_id || !action) {
    return NextResponse.json({ error: 'agent_id and action required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('agent_logs')
    .insert({ agent_id, action, detail: detail || '', metadata: metadata || {} })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
