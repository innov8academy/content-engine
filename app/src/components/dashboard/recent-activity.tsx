"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAgentLogs } from "@/hooks/use-agent-status";
import { AGENTS } from "@/lib/constants";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Activity } from "lucide-react";

export function RecentActivity() {
  const { logs, loading } = useAgentLogs(15, 5000);

  const getAgent = (id: string) => AGENTS[id as keyof typeof AGENTS];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-base">Live Activity Feed</CardTitle>
          {logs.length > 0 && (
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading && logs.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
            Loading activity...
          </div>
        ) : logs.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
            No activity yet. Run your first pipeline to see agents in action.
          </div>
        ) : (
          <div className="space-y-1 max-h-[300px] overflow-y-auto">
            <AnimatePresence initial={false}>
              {logs.map((log) => {
                const agent = getAgent(log.agent_id);
                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-start gap-3 py-2 px-2 rounded-md hover:bg-zinc-900/50 transition-colors"
                  >
                    <span className="text-lg mt-0.5">{agent?.emoji || '🤖'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium" style={{ color: agent?.color }}>
                          {agent?.name || log.agent_id}
                        </span>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          {log.action}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {log.detail}
                      </p>
                    </div>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap mt-1">
                      {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
