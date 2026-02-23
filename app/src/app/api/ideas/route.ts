import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const channelId = searchParams.get('channelId');
  const status = searchParams.get('status');

  let query = supabase
    .from('ideas')
    .select('*')
    .order('created_at', { ascending: false });

  if (channelId) query = query.eq('channel_id', channelId);
  if (status) query = query.eq('status', status);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ideas: data });
}
