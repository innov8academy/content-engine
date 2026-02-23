"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Zap, Play, Pause, Settings } from "lucide-react";
import { AGENTS } from "@/lib/constants";

const agents = Object.values(AGENTS);

const mockMessages = [
  {
    agentId: "scout",
    content: "Found 3 trending topics this morning:\n\n1. 🔥 Cursor AI's new agent mode (velocity: 94)\n2. 📈 OpenAI's image gen update (velocity: 87)\n3. 🆕 Lovable.dev hitting $4M ARR (velocity: 72)\n\nCompetitor @aitools.daily posted about Cursor yesterday — got 45K views. Gap: no one covered the AGENT mode.",
    time: "9:02 AM",
    type: "research",
  },
  {
    agentId: "voice",
    content: "Channel fit analysis:\n\n🔵 @innov8.ai → Cursor Agent Mode (perfect fit, tool review format)\n🟣 @alextom.ai → Lovable.dev story (founder angle)\n🟢 @innov8.academy → OpenAI image gen (tutorial format, Malayalam)",
    time: "9:03 AM",
    type: "analysis",
  },
  {
    agentId: "critic",
    content: "Quick assessment:\n\n✅ Cursor Agent Mode — HIGH potential. Trend is fresh, competitor missed the angle. Score: 9.1\n✅ Lovable story — GOOD. Founder narrative resonates. Score: 7.8\n⚠️ OpenAI image gen — RISKY. Topic is saturated from last week. Consider AI Avatar tools instead? Score: 5.4",
    time: "9:04 AM",
    type: "review",
  },
  {
    agentId: "writer",
    content: "Starting script for Cursor Agent Mode (@innov8.ai).\n\nUsing \"tool-review\" template with bold-claim hook style.\n\n**Hook draft:** \"Cursor just made every other code editor obsolete — and no one's talking about this feature\"\n\nWant me to continue with this angle?",
    time: "9:05 AM",
    type: "draft",
  },
];

export default function WarRoomPage() {
  return (
    <div className="flex flex-1 flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-500">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-semibold">War Room</h1>
            <p className="text-xs text-muted-foreground">Weekly Content Pipeline</p>
          </div>
          <Badge variant="secondary" className="text-[10px] bg-green-500/20 text-green-400">
            In Progress
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Tabs defaultValue="all">
            <TabsList className="h-8">
              <TabsTrigger value="all" className="text-xs px-3">All</TabsTrigger>
              {agents.slice(0, 4).map((agent) => (
                <TabsTrigger key={agent.id} value={agent.id} className="text-xs px-2">
                  {agent.emoji}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Settings className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Agent Status Bar */}
      <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-2 bg-zinc-950/50">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="flex items-center gap-1.5 rounded-full border border-zinc-800 px-2.5 py-1 text-xs hover:bg-accent cursor-pointer transition-colors"
          >
            <span>{agent.emoji}</span>
            <span className="text-muted-foreground">{agent.name}</span>
            <div className={`h-1.5 w-1.5 rounded-full ${
              agent.id === "scout" || agent.id === "writer" ? "bg-green-500 animate-pulse" : "bg-zinc-600"
            }`} />
          </div>
        ))}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {mockMessages.map((msg, i) => {
            const agent = AGENTS[msg.agentId as keyof typeof AGENTS];
            return (
              <div key={i} className="flex gap-3">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm"
                  style={{ backgroundColor: `${agent.color}20` }}
                >
                  {agent.emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">{agent.name}</span>
                    <span className="text-xs text-muted-foreground">{msg.time}</span>
                  </div>
                  <Card>
                    <CardContent className="p-3">
                      <p className="text-sm whitespace-pre-line">{msg.content}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            );
          })}

          {/* User can interject */}
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-sm">
              👤
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium">Alex</span>
                <span className="text-xs text-muted-foreground">9:06 AM</span>
              </div>
              <Card className="border-blue-500/30">
                <CardContent className="p-3">
                  <p className="text-sm">Agree on Cursor and Lovable. For academy, do the AI avatar tools comparison instead — I have footage.</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex gap-3">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm"
              style={{ backgroundColor: `${AGENTS.scout.color}20` }}
            >
              🔍
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium">Scout</span>
                <span className="text-xs text-muted-foreground">9:06 AM</span>
              </div>
              <Card>
                <CardContent className="p-3">
                  <p className="text-sm">On it. Researching top AI avatar tools for comparison...</p>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                    <div className="h-full w-[40%] rounded-full bg-amber-500 animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-zinc-800 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Button size="sm" variant="outline" className="gap-1 text-xs">
              <Play className="h-3 w-3" />
              Run Full Pipeline
            </Button>
            <Button size="sm" variant="outline" className="gap-1 text-xs">
              <Pause className="h-3 w-3" />
              Pause
            </Button>
          </div>
          <div className="flex gap-2">
            <Input placeholder="Message the agents..." className="flex-1" />
            <Button>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
