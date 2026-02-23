"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface Idea {
  id: string;
  channel_id: string;
  title: string;
  description: string;
  angle: string;
  hooks: string[];
  format: string;
  tags: string[];
  status: string;
  priority: number;
  virality_score: number;
  target_audience: string;
  key_points: string[];
  cta_strategy: string;
  source: string;
  created_at: string;
  updated_at: string;
}

export function useIdeas(channelId?: string) {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIdeas = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('ideas')
        .select('*')
        .order('created_at', { ascending: false });

      if (channelId) query = query.eq('channel_id', channelId);

      const { data, error: err } = await query;
      if (err) throw err;
      setIdeas(data || []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to fetch ideas');
    } finally {
      setLoading(false);
    }
  }, [channelId]);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  const generateIdeas = async (channelId: string, topic?: string, count = 5) => {
    const res = await fetch('/api/ideas/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channelId, topic, count }),
    });
    const data = await res.json();
    if (data.ideas) {
      setIdeas(prev => [...data.ideas, ...prev]);
    }
    return data;
  };

  return { ideas, loading, error, refetch: fetchIdeas, generateIdeas };
}
