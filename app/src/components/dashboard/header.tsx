"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Lightbulb, PenTool, ClipboardList } from "lucide-react";

export function DashboardHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mission Control</h1>
        <p className="text-sm text-muted-foreground">
          Your content pipeline at a glance
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <span className="text-blue-500">●</span> 0/1
          </Badge>
          <Badge variant="outline" className="gap-1">
            <span className="text-violet-500">●</span> 0/1
          </Badge>
          <Badge variant="outline" className="gap-1">
            <span className="text-emerald-500">●</span> 0/1
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="gap-1">
            <Lightbulb className="h-3.5 w-3.5" />
            Generate Ideas
          </Button>
          <Button size="sm" variant="outline" className="gap-1">
            <PenTool className="h-3.5 w-3.5" />
            Start Script
          </Button>
          <Button size="sm" className="gap-1 bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600">
            <Zap className="h-3.5 w-3.5" />
            Run Pipeline
          </Button>
        </div>
      </div>
    </div>
  );
}
