"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { PenTool, Search, Filter, Clock, FileText, Star, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { motion } from "framer-motion";

const channelMap: Record<string, { handle: string; color: string }> = {
  innov8ai: { handle: '@innov8.ai', color: '#3B82F6' },
  alextom: { handle: '@alextom.ai', color: '#8B5CF6' },
  academy: { handle: '@innov8.academy', color: '#10B981' },
};

const statusColors: Record<string, string> = {
  draft: "bg-zinc-500/20 text-zinc-400",
  review: "bg-yellow-500/20 text-yellow-400",
  approved: "bg-green-500/20 text-green-400",
  recorded: "bg-blue-500/20 text-blue-400",
  posted: "bg-emerald-500/20 text-emerald-400",
};

interface Script {
  id: string;
  channel_id: string;
  title: string;
  hook: string;
  word_count: number;
  estimated_duration: number;
  template: string;
  status: string;
  critic_score: { overall: number } | null;
  created_at: string;
}

export default function ScriptsPage() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch_scripts() {
      const { data } = await supabase
        .from('scripts')
        .select('*')
        .order('created_at', { ascending: false });
      setScripts(data || []);
      setLoading(false);
    }
    fetch_scripts();
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Scripts</h1>
          <p className="text-sm text-muted-foreground">{scripts.length} scripts</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search scripts..." className="pl-9" />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : scripts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <PenTool className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-1">No scripts yet</h3>
          <p className="text-sm text-muted-foreground">
            Go to Ideas and click &quot;Script This&quot; to generate your first script.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scripts.map((script, i) => {
            const channel = channelMap[script.channel_id];
            return (
              <motion.div
                key={script.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/scripts/${script.id}`}>
                  <Card className="cursor-pointer hover:border-zinc-600 transition-all group">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: channel?.color || '#888' }} />
                          <span className="text-xs text-muted-foreground">{channel?.handle || script.channel_id}</span>
                        </div>
                        <Badge variant="secondary" className={`text-[10px] ${statusColors[script.status] || ''}`}>
                          {script.status}
                        </Badge>
                      </div>
                      <h3 className="text-sm font-medium mb-2 group-hover:text-white transition-colors">
                        {script.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-4 line-clamp-2 italic">
                        &quot;{script.hook}&quot;
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" /> {script.word_count || 0}w
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {script.estimated_duration || 0}s
                          </span>
                          <Badge variant="outline" className="text-[10px]">{script.template}</Badge>
                        </div>
                        {script.critic_score && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                            <span className="text-xs font-medium text-amber-500">
                              {script.critic_score.overall}
                            </span>
                          </div>
                        )}
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
