"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PIPELINE_STATUSES } from "@/lib/constants";

const statusConfig: Record<string, { label: string; color: string }> = {
  idea: { label: "Ideas", color: "bg-blue-500/20 text-blue-400" },
  developing: { label: "Developing", color: "bg-yellow-500/20 text-yellow-400" },
  scripted: { label: "Scripted", color: "bg-orange-500/20 text-orange-400" },
  approved: { label: "Approved", color: "bg-cyan-500/20 text-cyan-400" },
  recording: { label: "Recording", color: "bg-purple-500/20 text-purple-400" },
  editing: { label: "Editing", color: "bg-pink-500/20 text-pink-400" },
  posted: { label: "Posted", color: "bg-green-500/20 text-green-400" },
};

export function PipelineKanban() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Content Pipeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {PIPELINE_STATUSES.map((status) => {
            const config = statusConfig[status];
            return (
              <div
                key={status}
                className="flex-shrink-0 w-[140px] rounded-lg border border-dashed border-zinc-800 p-3 min-h-[200px]"
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary" className={`text-[10px] ${config.color}`}>
                    {config.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">0</span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="rounded-md border border-dashed border-zinc-800 p-4 text-center">
                    <p className="text-xs text-muted-foreground">Drop content here</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
