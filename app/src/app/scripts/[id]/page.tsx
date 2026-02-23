"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft, Star, Clock, FileText, ClipboardList, Send,
  Sparkles, MessageSquare, Eye, Loader2, CheckCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use } from "react";

const channelMap: Record<string, { handle: string; color: string }> = {
  innov8ai: { handle: '@innov8.ai', color: '#3B82F6' },
  alextom: { handle: '@alextom.ai', color: '#8B5CF6' },
  academy: { handle: '@innov8.academy', color: '#10B981' },
};

interface Script {
  id: string;
  channel_id: string;
  title: string;
  hook: string;
  hook_variations: string[];
  body: string;
  cta: string;
  outro: string;
  visual_cues: { timestamp: string; visual: string; textOverlay: string }[];
  speaker_notes: string;
  word_count: number;
  estimated_duration: number;
  template: string;
  status: string;
  version: number;
  critic_score: { hook: number; voice: number; value: number; cta: number; overall: number } | null;
  critic_feedback: string;
}

export default function ScriptStudioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [script, setScript] = useState<Script | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);
  const [briefing, setBriefing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchScript() {
      const { data } = await supabase
        .from('scripts')
        .select('*')
        .eq('id', id)
        .single();
      if (data) setScript(data);
      setLoading(false);
    }
    fetchScript();
  }, [id]);

  const handleReview = async () => {
    setReviewing(true);
    try {
      const res = await fetch(`/api/scripts/${id}/review`, { method: 'POST' });
      const data = await res.json();
      if (data.script) setScript(data.script);
    } catch (e) {
      console.error(e);
    } finally {
      setReviewing(false);
    }
  };

  const handleCreateBrief = async () => {
    setBriefing(true);
    try {
      const res = await fetch('/api/briefs/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scriptId: id }),
      });
      const data = await res.json();
      if (data.brief) {
        router.push(`/briefs/${data.brief.id}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setBriefing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!script) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-muted-foreground">Script not found</p>
      </div>
    );
  }

  const channel = channelMap[script.channel_id];
  const hookVariations = Array.isArray(script.hook_variations) ? script.hook_variations : [];
  const visualCues = Array.isArray(script.visual_cues) ? script.visual_cues : [];

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
            <span className="text-sm font-medium truncate max-w-[300px]">{script.title}</span>
          </div>
          <Badge variant="secondary" className="text-[10px]">{script.status}</Badge>
          <Badge variant="outline" className="text-[10px]">v{script.version}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3 text-xs text-muted-foreground mr-4">
            <span className="flex items-center gap-1">
              <FileText className="h-3 w-3" /> {script.word_count}w
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {script.estimated_duration}s
            </span>
            {script.critic_score && (
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 text-amber-500 fill-amber-500" /> {script.critic_score.overall}
              </span>
            )}
          </div>
          <Button size="sm" variant="outline" className="gap-1" onClick={handleReview} disabled={reviewing}>
            {reviewing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Star className="h-3.5 w-3.5" />}
            {reviewing ? 'Reviewing...' : 'Critic Review'}
          </Button>
          <Button size="sm" variant="outline" className="gap-1" onClick={handleCreateBrief} disabled={briefing}>
            {briefing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ClipboardList className="h-3.5 w-3.5" />}
            {briefing ? 'Creating...' : 'Create Brief'}
          </Button>
        </div>
      </div>

      {/* Main Content — Split View */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Script Editor */}
        <div className="flex-1 overflow-y-auto border-r border-zinc-800 p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Hook */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-500">🎣 Hook (0:00-0:05)</h3>
              </div>
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
                <p className="text-sm font-medium leading-relaxed">{script.hook}</p>
              </div>
              {hookVariations.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  {hookVariations.map((h: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 rounded-md border border-zinc-800 p-2.5 text-xs text-muted-foreground hover:border-zinc-600 cursor-pointer transition-colors">
                      <span className="text-[10px] text-zinc-600">Alt {i + 1}</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Body */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-500 mb-2">📝 Body</h3>
              <div className="rounded-lg border border-zinc-800 p-4">
                <p className="text-sm leading-relaxed whitespace-pre-line">{script.body}</p>
              </div>
            </div>

            {/* CTA */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-500 mb-2">🎯 CTA (0:55-1:00)</h3>
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
                <p className="text-sm font-medium">{script.cta}</p>
              </div>
            </div>

            {/* Outro */}
            {script.outro && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">👋 Outro</h3>
                <div className="rounded-lg border border-zinc-800 p-4">
                  <p className="text-sm text-muted-foreground">{script.outro}</p>
                </div>
              </div>
            )}

            {/* Speaker Notes */}
            {script.speaker_notes && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-violet-500 mb-2">🎙️ Speaker Notes</h3>
                <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-4">
                  <p className="text-xs text-muted-foreground italic">{script.speaker_notes}</p>
                </div>
              </div>
            )}

            {/* Critic Review */}
            {script.critic_score && (
              <Card className="border-amber-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500" /> Critic Review — {script.critic_score.overall}/10
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-3 mb-3">
                    {Object.entries(script.critic_score)
                      .filter(([k]) => k !== 'overall')
                      .map(([key, value]) => (
                        <div key={key} className="text-center">
                          <p className="text-lg font-bold">{value as number}</p>
                          <p className="text-[10px] text-muted-foreground capitalize">{key}</p>
                        </div>
                      ))}
                  </div>
                  <Separator className="my-3" />
                  <p className="text-xs text-muted-foreground">{script.critic_feedback}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Right: AI Chat placeholder */}
        <div className="w-[380px] flex flex-col bg-zinc-950/50">
          <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-2.5">
            <MessageSquare className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">AI Assistant</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-sm">✍️</div>
              <div className="rounded-lg border border-zinc-800 p-3 text-xs">
                <p className="text-muted-foreground">
                  Script generated with <span className="text-white font-medium">{script.template}</span> template.
                  {script.word_count && <> Word count: <span className="text-emerald-500 font-medium">{script.word_count}</span>.</>}
                </p>
                <p className="text-muted-foreground mt-2">
                  Click <strong>Critic Review</strong> to get quality scores, or <strong>Create Brief</strong> to generate an editor document.
                </p>
              </div>
            </div>
            {script.critic_score && (
              <div className="flex gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-sm">🎯</div>
                <div className="rounded-lg border border-zinc-800 p-3 text-xs">
                  <p className="text-muted-foreground">
                    <span className="text-white font-medium">Critic review complete.</span> Overall: {script.critic_score.overall}/10
                  </p>
                  <p className="text-muted-foreground mt-2">{script.critic_feedback}</p>
                </div>
              </div>
            )}
          </div>
          <div className="border-t border-zinc-800 px-4 py-2">
            <div className="flex gap-1.5 flex-wrap">
              <Button size="sm" variant="outline" className="text-[10px] h-6 px-2" onClick={handleReview} disabled={reviewing}>
                🎯 {reviewing ? 'Reviewing...' : 'Critic Review'}
              </Button>
              <Button size="sm" variant="outline" className="text-[10px] h-6 px-2" onClick={handleCreateBrief} disabled={briefing}>
                📋 {briefing ? 'Creating...' : 'Create Brief'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Visual Cues */}
      {visualCues.length > 0 && (
        <div className="border-t border-zinc-800 px-4 py-2.5">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium">Visual Cues Timeline</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {visualCues.map((cue: { timestamp: string; visual: string; textOverlay: string }, i: number) => (
              <div key={i} className="flex-shrink-0 rounded-md border border-zinc-800 p-2 w-[180px] hover:border-zinc-600 cursor-pointer transition-colors">
                <p className="text-[10px] text-muted-foreground mb-1">{cue.timestamp}</p>
                <p className="text-[10px] font-medium mb-0.5">{cue.textOverlay}</p>
                <p className="text-[10px] text-muted-foreground line-clamp-1">{cue.visual}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
