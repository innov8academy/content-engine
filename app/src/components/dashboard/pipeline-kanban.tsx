"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PIPELINE_STATUSES, CHANNELS } from "@/lib/constants";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface PipelineItem {
  id: string;
  title: string;
  channel_id: string;
  status: string;
  type: 'idea' | 'script' | 'brief';
}

const statusConfig: Record<string, { label: string; color: string; emoji: string }> = {
  idea: { label: "Ideas", color: "bg-blue-500/20 text-blue-400", emoji: "💡" },
  developing: { label: "Developing", color: "bg-yellow-500/20 text-yellow-400", emoji: "🔬" },
  scripted: { label: "Scripted", color: "bg-orange-500/20 text-orange-400", emoji: "✍️" },
  approved: { label: "Approved", color: "bg-cyan-500/20 text-cyan-400", emoji: "✅" },
  recording: { label: "Recording", color: "bg-purple-500/20 text-purple-400", emoji: "🎬" },
  editing: { label: "Editing", color: "bg-pink-500/20 text-pink-400", emoji: "✂️" },
  posted: { label: "Posted", color: "bg-green-500/20 text-green-400", emoji: "🚀" },
};

// Map idea/script statuses to pipeline statuses
function mapToPipelineStatus(item: { status: string; type: string }): string {
  if (item.type === 'idea') {
    if (item.status === 'raw' || item.status === 'idea') return 'idea';
    if (item.status === 'developing') return 'developing';
    if (item.status === 'approved') return 'approved';
    return 'idea';
  }
  if (item.type === 'script') {
    if (item.status === 'draft') return 'scripted';
    if (item.status === 'reviewed' || item.status === 'approved') return 'approved';
    return 'scripted';
  }
  if (item.type === 'brief') {
    return 'editing';
  }
  return 'idea';
}

export function PipelineKanban() {
  const [items, setItems] = useState<PipelineItem[]>([]);

  useEffect(() => {
    async function fetchPipeline() {
      try {
        // Fetch ideas
        const ideasRes = await fetch('/api/ideas');
        const ideas = ideasRes.ok ? await ideasRes.json() : [];

        // Fetch scripts
        const scriptsRes = await fetch('/api/scripts');
        const scripts = scriptsRes.ok ? await scriptsRes.json() : [];

        const mapped: PipelineItem[] = [
          ...(ideas || []).map((i: { id: string; title: string; channel_id: string; status: string }) => ({
            id: i.id,
            title: i.title,
            channel_id: i.channel_id,
            status: mapToPipelineStatus({ status: i.status, type: 'idea' }),
            type: 'idea' as const,
          })),
          ...(scripts || []).map((s: { id: string; title: string; channel_id: string; status: string }) => ({
            id: s.id,
            title: s.title,
            channel_id: s.channel_id,
            status: mapToPipelineStatus({ status: s.status, type: 'script' }),
            type: 'script' as const,
          })),
        ];

        setItems(mapped);
      } catch {
        // silent
      }
    }

    fetchPipeline();
    const id = setInterval(fetchPipeline, 10000);
    return () => clearInterval(id);
  }, []);

  const getItemsByStatus = (status: string) => items.filter(i => i.status === status);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Content Pipeline</CardTitle>
          <span className="text-xs text-muted-foreground">{items.length} items</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {PIPELINE_STATUSES.map((status) => {
            const config = statusConfig[status];
            const statusItems = getItemsByStatus(status);
            return (
              <div
                key={status}
                className="flex-shrink-0 w-[150px] rounded-lg border border-dashed border-zinc-800 p-3 min-h-[200px]"
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary" className={`text-[10px] ${config.color}`}>
                    {config.emoji} {config.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{statusItems.length}</span>
                </div>
                <div className="flex flex-col gap-2">
                  {statusItems.length === 0 ? (
                    <div className="rounded-md border border-dashed border-zinc-800 p-3 text-center">
                      <p className="text-[10px] text-muted-foreground">Empty</p>
                    </div>
                  ) : (
                    statusItems.map((item) => {
                      const channel = CHANNELS[item.channel_id as keyof typeof CHANNELS];
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="rounded-md border border-zinc-800 p-2 hover:border-zinc-600 transition-colors cursor-pointer"
                        >
                          <div
                            className="h-1 w-8 rounded-full mb-1.5"
                            style={{ backgroundColor: channel?.color || '#666' }}
                          />
                          <p className="text-[11px] font-medium line-clamp-2 leading-tight">
                            {item.title}
                          </p>
                          <p className="text-[9px] text-muted-foreground mt-1">
                            {channel?.handle || item.channel_id}
                          </p>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
