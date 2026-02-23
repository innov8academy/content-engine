"use client";

import { Card, CardContent } from "@/components/ui/card";
import { AGENTS } from "@/lib/constants";
import { useAgentStatus } from "@/hooks/use-agent-status";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const statusColors: Record<string, string> = {
  active: "bg-green-500",
  idle: "bg-zinc-600",
  error: "bg-red-500",
  waiting: "bg-yellow-500",
};

const statusGlow: Record<string, string> = {
  active: "shadow-[0_0_12px_rgba(34,197,94,0.5)]",
  error: "shadow-[0_0_12px_rgba(239,68,68,0.5)]",
  waiting: "shadow-[0_0_8px_rgba(234,179,8,0.3)]",
  idle: "",
};

export function AgentGrid() {
  const { statuses, loading } = useAgentStatus(3000);
  const agents = Object.values(AGENTS);

  const getStatus = (agentId: string) => {
    return statuses.find(s => s.agent_id === agentId) || {
      status: 'idle' as const,
      detail: loading ? 'Loading...' : 'Offline',
      metric: '--',
      progress: 0,
      current_task: '',
    };
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {agents.map((agent, i) => {
        const status = getStatus(agent.id);
        const isActive = status.status === 'active';

        return (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className={`cursor-pointer hover:border-accent transition-all group relative overflow-hidden ${isActive ? statusGlow.active : ''}`}>
              {/* Active agent shimmer */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 opacity-10"
                  style={{ background: `linear-gradient(135deg, transparent 40%, ${agent.color} 50%, transparent 60%)` }}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
              )}
              <CardContent className="p-4 relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{agent.emoji}</span>
                  <div className="flex items-center gap-1.5">
                    {isActive && (
                      <Loader2 className="h-3 w-3 animate-spin" style={{ color: agent.color }} />
                    )}
                    <div className="relative">
                      <div
                        className={`h-2.5 w-2.5 rounded-full ${statusColors[status.status] || statusColors.idle}`}
                      />
                      {isActive && (
                        <div
                          className={`absolute inset-0 h-2.5 w-2.5 rounded-full ${statusColors.active} animate-ping`}
                        />
                      )}
                    </div>
                    <span className="text-[10px] uppercase text-muted-foreground font-medium">
                      {status.status}
                    </span>
                  </div>
                </div>
                <p className="text-sm font-semibold mb-0.5">{agent.name}</p>
                {status.current_task && isActive && (
                  <p className="text-[11px] font-medium mb-1 truncate" style={{ color: agent.color }}>
                    {status.current_task}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                  {status.detail}
                </p>
                {/* Progress bar when active */}
                {isActive && status.progress > 0 && (
                  <div className="w-full h-1 bg-zinc-800 rounded-full mb-2 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: agent.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${status.progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                )}
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
