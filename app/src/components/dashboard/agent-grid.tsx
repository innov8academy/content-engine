"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AGENTS } from "@/lib/constants";
import { motion } from "framer-motion";

const agentStatuses: Record<string, {
  status: "active" | "idle" | "error";
  detail: string;
  metric: string;
  progress?: number;
}> = {
  scout: { status: "idle", detail: "Last scan: 2h ago", metric: "15 trends tracked", progress: 100 },
  voice: { status: "idle", detail: "Ready", metric: "Match: --", progress: 0 },
  writer: { status: "idle", detail: "No scripts in queue", metric: "0 drafts", progress: 0 },
  editor: { status: "idle", detail: "No briefs pending", metric: "0 briefs", progress: 0 },
  critic: { status: "idle", detail: "Waiting for content", metric: "No reviews", progress: 0 },
  calendar: { status: "idle", detail: "0 posts scheduled", metric: "This week: 0/3", progress: 0 },
};

export function AgentGrid() {
  const agents = Object.values(AGENTS);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {agents.map((agent, i) => {
        const status = agentStatuses[agent.id];
        return (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="cursor-pointer hover:border-accent transition-colors group">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{agent.emoji}</span>
                  <div className="flex items-center gap-1">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        status.status === "active"
                          ? "bg-green-500 animate-pulse"
                          : status.status === "error"
                          ? "bg-red-500"
                          : "bg-zinc-600"
                      }`}
                    />
                    <span className="text-[10px] uppercase text-muted-foreground">
                      {status.status}
                    </span>
                  </div>
                </div>
                <p className="text-sm font-medium mb-1">{agent.name}</p>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                  {status.detail}
                </p>
                <p className="text-xs font-medium" style={{ color: agent.color }}>
                  {status.metric}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
