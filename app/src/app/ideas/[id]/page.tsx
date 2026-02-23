"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, PenTool, Sparkles, TrendingUp, Target, Users, Lightbulb, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use } from "react";

const channelMap: Record<string, { name: string; handle: string; color: string }> = {
  innov8ai: { name: 'Innov8 AI', handle: '@innov8.ai', color: '#3B82F6' },
  alextom: { name: 'Alex Tom AI', handle: '@alextom.ai', color: '#8B5CF6' },
  academy: { name: 'Innov8 Academy', handle: '@innov8.academy', color: '#10B981' },
};

interface Idea {
  id: string;
  channel_id: string;
  title: string;
  description: string;
  angle: string;
  hooks: string[];
  format: string;
  tags: string[];
  status: string;
  priority: number;
  virality_score: number;
  target_audience: string;
  key_points: string[];
  cta_strategy: string;
  source: string;
  created_at: string;
}

export default function IdeaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [scripting, setScripting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchIdea() {
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .eq('id', id)
        .single();

      if (data) setIdea(data);
      setLoading(false);
    }
    fetchIdea();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6 max-w-4xl">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <p className="text-muted-foreground">Idea not found</p>
      </div>
    );
  }

  const channel = channelMap[idea.channel_id];
  const hooks = Array.isArray(idea.hooks) ? idea.hooks : [];
  const keyPoints = Array.isArray(idea.key_points) ? idea.key_points : [];
  const tags = Array.isArray(idea.tags) ? idea.tags : [];

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/ideas">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: channel?.color }} />
            <span className="text-sm text-muted-foreground">{channel?.handle}</span>
            <Badge variant="secondary" className="text-[10px]">{idea.status}</Badge>
            <Badge variant="outline" className="text-[10px]">{idea.source}</Badge>
          </div>
          <h1 className="text-xl font-bold">{idea.title}</h1>
        </div>
        <Button
          className="gap-1 bg-gradient-to-r from-blue-500 to-violet-500"
          disabled={scripting}
          onClick={async () => {
            setScripting(true);
            try {
              const res = await fetch('/api/scripts/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ideaId: idea.id, template: 'tool-review' }),
              });
              const data = await res.json();
              if (data.script) {
                router.push(`/scripts/${data.script.id}`);
              }
            } catch (e) {
              console.error(e);
            } finally {
              setScripting(false);
            }
          }}
        >
          {scripting ? (
            <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Writing Script...</>
          ) : (
            <><PenTool className="h-3.5 w-3.5" /> Script This</>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-5 w-5 mx-auto mb-1 text-amber-500" />
            <p className="text-2xl font-bold text-amber-500">{idea.virality_score}</p>
            <p className="text-xs text-muted-foreground">Virality Score</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-5 w-5 mx-auto mb-1 text-blue-500" />
            <p className="text-2xl font-bold">{idea.priority}/10</p>
            <p className="text-xs text-muted-foreground">Priority</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-5 w-5 mx-auto mb-1 text-emerald-500" />
            <p className="text-sm font-medium">{idea.format}</p>
            <p className="text-xs text-muted-foreground">Format</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{idea.description}</p>
        </CardContent>
      </Card>

      {idea.angle && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              Angle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{idea.angle}</p>
          </CardContent>
        </Card>
      )}

      {hooks.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-500" />
              Hook Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {hooks.map((hook: string, i: number) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-zinc-800 p-3 hover:border-zinc-600 cursor-pointer transition-colors">
                <span className="text-xs text-muted-foreground mt-0.5">#{i + 1}</span>
                <p className="text-sm font-medium">{hook}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {keyPoints.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Key Points</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {keyPoints.map((point: string, i: number) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  {point}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {idea.target_audience && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Target Audience</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{idea.target_audience}</p>
            </CardContent>
          </Card>
        )}
        {idea.cta_strategy && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">CTA Strategy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium">{idea.cta_strategy}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {tags.map((tag: string) => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
        </div>
      )}
    </div>
  );
}
