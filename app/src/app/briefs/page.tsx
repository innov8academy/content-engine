"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ClipboardList, Search, Film, Music, Image, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { motion } from "framer-motion";

const channelMap: Record<string, { handle: string; color: string }> = {
  innov8ai: { handle: '@innov8.ai', color: '#3B82F6' },
  alextom: { handle: '@alextom.ai', color: '#8B5CF6' },
  academy: { handle: '@innov8.academy', color: '#10B981' },
};

interface Brief {
  id: string;
  channel_id: string;
  scenes: unknown[];
  music_mood: string;
  thumbnail_concepts: unknown[];
  hashtags: string[];
  status: string;
  created_at: string;
}

export default function BriefsPage() {
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBriefs() {
      const { data } = await supabase
        .from('editor_briefs')
        .select('*')
        .order('created_at', { ascending: false });
      setBriefs(data || []);
      setLoading(false);
    }
    fetchBriefs();
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Editor Briefs</h1>
        <p className="text-sm text-muted-foreground">{briefs.length} briefs</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : briefs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ClipboardList className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-1">No briefs yet</h3>
          <p className="text-sm text-muted-foreground">
            Open a script and click &quot;Create Brief&quot; to generate an editor document.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {briefs.map((brief, i) => {
            const channel = channelMap[brief.channel_id];
            const scenes = Array.isArray(brief.scenes) ? brief.scenes : [];
            const thumbs = Array.isArray(brief.thumbnail_concepts) ? brief.thumbnail_concepts : [];
            const tags = Array.isArray(brief.hashtags) ? brief.hashtags : [];
            return (
              <motion.div key={brief.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link href={`/briefs/${brief.id}`}>
                  <Card className="cursor-pointer hover:border-zinc-600 transition-all group">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: channel?.color || '#888' }} />
                          <span className="text-xs text-muted-foreground">{channel?.handle}</span>
                        </div>
                        <Badge variant="secondary" className="text-[10px]">{brief.status}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Film className="h-3 w-3" /> {scenes.length} scenes</span>
                        <span className="flex items-center gap-1"><Music className="h-3 w-3" /> {brief.music_mood?.split(',')[0] || 'No music'}</span>
                        <span className="flex items-center gap-1"><Image className="h-3 w-3" /> {thumbs.length} thumbs</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
