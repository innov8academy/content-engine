"use client";

import { useState, useEffect, useCallback } from 'react';

export interface AgentStatus {
  agent_id: string;
  status: 'idle' | 'active' | 'error' | 'waiting';
  current_task: string;
  detail: string;
  metric: string;
  progress: number;
  last_active_at: string;
  updated_at: string;
}

export interface AgentLog {
  id: string;
  agent_id: string;
  action: string;
  detail: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export function useAgentStatus(pollInterval = 5000) {
  const [statuses, setStatuses] = useState<AgentStatus[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch('/api/agents/status');
      if (res.ok) {
        const data = await res.json();
        setStatuses(data);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch_();
    const id = setInterval(fetch_, pollInterval);
    return () => clearInterval(id);
  }, [fetch_, pollInterval]);

  return { statuses, loading, refetch: fetch_ };
}

export function useAgentLogs(limit = 20, pollInterval = 5000) {
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch(`/api/agents/log?limit=${limit}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetch_();
    const id = setInterval(fetch_, pollInterval);
    return () => clearInterval(id);
  }, [fetch_, pollInterval]);

  return { logs, loading };
}
