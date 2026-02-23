"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface Script {
  id: string;
  idea_id: string;
  channel_id: string;
  title: string;
  hook: string;
  hook_variations: string[];
  body: string;
  cta: string;
  outro: string;
  visual_cues: { timestamp: string; visual: string; textOverlay: string }[];
  speaker_notes: string;
  word_count: number;
  estimated_duration: number;
  template: string;
  style: string;
  language: string;
  status: string;
  version: number;
  critic_score: { hook: number; voice: number; value: number; cta: number; overall: number } | null;
  critic_feedback: string;
  created_at: string;
  updated_at: string;
}

export function useScripts(channelId?: string) {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchScripts = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('scripts')
        .select('*')
        .order('created_at', { ascending: false });

      if (channelId) query = query.eq('channel_id', channelId);

      const { data } = await query;
      setScripts(data || []);
    } finally {
      setLoading(false);
    }
  }, [channelId]);

  useEffect(() => {
    fetchScripts();
  }, [fetchScripts]);

  const generateScript = async (ideaId: string, template?: string) => {
    const res = await fetch('/api/scripts/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ideaId, template }),
    });
    const data = await res.json();
    if (data.script) {
      setScripts(prev => [data.script, ...prev]);
    }
    return data;
  };

  const reviewScript = async (scriptId: string) => {
    const res = await fetch(`/api/scripts/${scriptId}/review`, {
      method: 'POST',
    });
    return res.json();
  };

  return { scripts, loading, refetch: fetchScripts, generateScript, reviewScript };
}
