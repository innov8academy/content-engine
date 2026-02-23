"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft, Star, Clock, FileText, ClipboardList, Send,
  Sparkles, Zap, MessageSquare, Eye, ChevronDown,
} from "lucide-react";
import { mockScripts, channelMap } from "@/lib/mock-data";
import Link from "next/link";
import { use } from "react";

export default function ScriptStudioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const script = mockScripts.find((s) => s.id === id) || mockScripts[0];
  const channel = channelMap[script.channelId];

  return (
    <div className="flex flex-1 flex-col h-screen">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <Link href="/scripts">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: channel?.color }} />
            <span className="text-sm font-medium">{script.title}</span>
          </div>
          <Badge variant="secondary" className="text-[10px]">{script.status}</Badge>
          <Badge variant="outline" className="text-[10px]">v{script.version}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3 text-xs text-muted-foreground mr-4">
            <span className="flex items-center gap-1">
              <FileText className="h-3 w-3" /> {script.wordCount}w
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {script.estimatedDuration}s
            </span>
            {script.criticScore && (
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 text-amber-500 fill-amber-500" /> {script.criticScore.overall}
              </span>
            )}
          </div>
          <Button size="sm" variant="outline" className="gap-1">
            <ClipboardList className="h-3.5 w-3.5" />
            Create Brief
          </Button>
        </div>
      </div>

      {/* Main Content — Split View */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Script Editor */}
        <div className="flex-1 overflow-y-auto border-r border-zinc-800 p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Hook Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-500">
                  🎣 Hook
                </h3>
                <Button size="sm" variant="ghost" className="text-xs gap-1 h-7">
                  <Sparkles className="h-3 w-3" /> Variations
                </Button>
              </div>
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
                <p className="text-sm font-medium leading-relaxed">{script.hook}</p>
              </div>
              {script.hookVariations.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  {script.hookVariations.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 rounded-md border border-zinc-800 p-2.5 text-xs text-muted-foreground hover:border-zinc-600 cursor-pointer transition-colors">
                      <span className="text-[10px] text-zinc-600">Alt {i + 1}</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Body Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-500">
                  📝 Body
                </h3>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" className="text-[10px] h-6 px-2">Punchier</Button>
                  <Button size="sm" variant="ghost" className="text-[10px] h-6 px-2">Simplify</Button>
                  <Button size="sm" variant="ghost" className="text-[10px] h-6 px-2">Expand</Button>
                </div>
              </div>
              <div className="rounded-lg border border-zinc-800 p-4">
                <p className="text-sm leading-relaxed whitespace-pre-line">{script.body}</p>
              </div>
            </div>

            {/* CTA Section */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-500 mb-2">
                🎯 Call to Action
              </h3>
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
                <p className="text-sm font-medium">{script.cta}</p>
              </div>
            </div>

            {/* Outro */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                👋 Outro
              </h3>
              <div className="rounded-lg border border-zinc-800 p-4">
                <p className="text-sm text-muted-foreground">{script.outro}</p>
              </div>
            </div>

            {/* Speaker Notes */}
            {script.speakerNotes && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-violet-500 mb-2">
                  🎙️ Speaker Notes
                </h3>
                <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-4">
                  <p className="text-xs text-muted-foreground italic">{script.speakerNotes}</p>
                </div>
              </div>
            )}

            {/* Critic Review */}
            {script.criticScore && (
              <Card className="border-amber-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500" />
                    Critic Review
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-3 mb-3">
                    {Object.entries(script.criticScore)
                      .filter(([k]) => k !== 'overall')
                      .map(([key, value]) => (
                        <div key={key} className="text-center">
                          <p className="text-lg font-bold">{value}</p>
                          <p className="text-[10px] text-muted-foreground capitalize">{key}</p>
                        </div>
                      ))}
                  </div>
                  <Separator className="my-3" />
                  <p className="text-xs text-muted-foreground">{script.criticFeedback}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Right: AI Chat */}
        <div className="w-[380px] flex flex-col bg-zinc-950/50">
          <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">AI Assistant</span>
            </div>
            <Tabs defaultValue="writer">
              <TabsList className="h-7">
                <TabsTrigger value="writer" className="text-[10px] px-2 h-5">✍️ Writer</TabsTrigger>
                <TabsTrigger value="critic" className="text-[10px] px-2 h-5">🎯 Critic</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Sample AI message */}
            <div className="flex gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-sm">
                ✍️
              </div>
              <div className="rounded-lg border border-zinc-800 p-3 text-xs">
                <p className="text-muted-foreground">
                  Script generated with <span className="text-white font-medium">comparison</span> template.
                  Voice match: <span className="text-emerald-500 font-medium">8.4/10</span>.
                </p>
                <p className="text-muted-foreground mt-2">
                  Hook #1 scored highest for scroll-stop potential. The body follows a strong contrast pattern (Cursor → Claude Code → revelation).
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-sm">
                🎯
              </div>
              <div className="rounded-lg border border-zinc-800 p-3 text-xs">
                <p className="text-muted-foreground">
                  <span className="text-white font-medium">Critic review complete.</span> Overall: 8.4/10.
                </p>
                <p className="text-muted-foreground mt-2">
                  Strong hook, good pacing. CTA could be more specific about what the breakdown includes. Consider adding a price comparison point.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border-t border-zinc-800 px-4 py-2">
            <div className="flex gap-1.5 flex-wrap mb-2">
              <Button size="sm" variant="outline" className="text-[10px] h-6 px-2">🔄 Regenerate</Button>
              <Button size="sm" variant="outline" className="text-[10px] h-6 px-2">💪 Punchier</Button>
              <Button size="sm" variant="outline" className="text-[10px] h-6 px-2">😄 Add humor</Button>
              <Button size="sm" variant="outline" className="text-[10px] h-6 px-2">🗣️ Malayalamize</Button>
            </div>
          </div>

          {/* Chat Input */}
          <div className="border-t border-zinc-800 p-3">
            <div className="flex gap-2">
              <Input placeholder="Ask the AI assistant..." className="text-xs h-9" />
              <Button size="sm" className="h-9 px-3">
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Visual Cues */}
      <div className="border-t border-zinc-800 px-4 py-2.5">
        <div className="flex items-center gap-2 mb-2">
          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-medium">Visual Cues Timeline</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {script.visualCues.map((cue, i) => (
            <div key={i} className="flex-shrink-0 rounded-md border border-zinc-800 p-2 w-[180px] hover:border-zinc-600 cursor-pointer transition-colors">
              <p className="text-[10px] text-muted-foreground mb-1">{cue.timestamp}</p>
              <p className="text-[10px] font-medium mb-0.5">{cue.textOverlay}</p>
              <p className="text-[10px] text-muted-foreground line-clamp-1">{cue.visual}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
