"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Copy, Download, MessageSquare, Film, Music, Image, Hash, FileText, Clock, Play } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { use } from "react";

const channelMap: Record<string, { handle: string; color: string }> = {
  innov8ai: { handle: '@innov8.ai', color: '#3B82F6' },
  alextom: { handle: '@alextom.ai', color: '#8B5CF6' },
  academy: { handle: '@innov8.academy', color: '#10B981' },
};

interface Scene { sceneNum: number; narration: string; visual: string; textOverlay: string; broll: string; transition: string; duration: number; }
interface Thumb { concept: string; text: string; style: string; }

interface Brief {
  id: string; channel_id: string; scenes: Scene[]; music_mood: string; music_suggestions: string[];
  thumbnail_concepts: Thumb[]; caption: string; hashtags: string[]; editor_notes: string; status: string;
}

export default function BriefDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [brief, setBrief] = useState<Brief | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBrief() {
      const { data } = await supabase.from('editor_briefs').select('*').eq('id', id).single();
      if (data) setBrief(data);
      setLoading(false);
    }
    fetchBrief();
  }, [id]);

  if (loading) return <div className="p-6"><Skeleton className="h-64 w-full" /></div>;
  if (!brief) return <div className="flex flex-1 items-center justify-center"><p className="text-muted-foreground">Brief not found</p></div>;

  const channel = channelMap[brief.channel_id];
  const scenes = Array.isArray(brief.scenes) ? brief.scenes : [];
  const thumbs = Array.isArray(brief.thumbnail_concepts) ? brief.thumbnail_concepts : [];
  const tags = Array.isArray(brief.hashtags) ? brief.hashtags : [];
  const musicSugs = Array.isArray(brief.music_suggestions) ? brief.music_suggestions : [];
  const totalDuration = scenes.reduce((acc, s) => acc + (s.duration || 0), 0);

  const copyAll = () => {
    const text = scenes.map(s =>
      `Scene ${s.sceneNum} (${s.duration}s):\nNarration: ${s.narration}\nVisual: ${s.visual}\nText: ${s.textOverlay}\nB-roll: ${s.broll}\nTransition: ${s.transition}`
    ).join('\n\n') + `\n\nMusic: ${brief.music_mood}\nCaption: ${brief.caption}\nHashtags: ${tags.join(' ')}`;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/briefs"><Button variant="ghost" size="icon" className="h-8 w-8"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: channel?.color }} />
              <span className="text-sm text-muted-foreground">{channel?.handle}</span>
              <Badge variant="secondary" className="text-[10px]">{brief.status}</Badge>
            </div>
            <h1 className="text-xl font-bold">Editor Brief</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="gap-1" onClick={copyAll}><Copy className="h-3.5 w-3.5" /> Copy All</Button>
          <Button size="sm" variant="outline" className="gap-1"><MessageSquare className="h-3.5 w-3.5" /> WhatsApp</Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center"><Film className="h-5 w-5 mx-auto mb-1 text-blue-500" /><p className="text-xl font-bold">{scenes.length}</p><p className="text-xs text-muted-foreground">Scenes</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><Clock className="h-5 w-5 mx-auto mb-1 text-amber-500" /><p className="text-xl font-bold">{totalDuration}s</p><p className="text-xs text-muted-foreground">Duration</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><Image className="h-5 w-5 mx-auto mb-1 text-emerald-500" /><p className="text-xl font-bold">{thumbs.length}</p><p className="text-xs text-muted-foreground">Thumbnails</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><Hash className="h-5 w-5 mx-auto mb-1 text-violet-500" /><p className="text-xl font-bold">{tags.length}</p><p className="text-xs text-muted-foreground">Hashtags</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-500 flex items-center gap-2"><Film className="h-4 w-4" /> Scene Breakdown</h2>
          {scenes.map((scene) => (
            <Card key={scene.sceneNum} className="hover:border-zinc-600 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline" className="text-xs">Scene {scene.sceneNum}</Badge>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{scene.duration}s</span>
                    <Badge variant="secondary" className="text-[10px]">{scene.transition}</Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <div><p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Narration</p><p className="text-sm">{scene.narration}</p></div>
                  <div><p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Visual</p><p className="text-sm text-muted-foreground">{scene.visual}</p></div>
                  <div className="flex gap-4">
                    <div className="flex-1"><p className="text-[10px] uppercase tracking-wider text-amber-500 mb-1">Text Overlay</p><p className="text-sm font-medium">{scene.textOverlay}</p></div>
                    <div className="flex-1"><p className="text-[10px] uppercase tracking-wider text-emerald-500 mb-1">B-Roll</p><p className="text-xs text-muted-foreground">{scene.broll}</p></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Music className="h-4 w-4 text-violet-500" /> Music</CardTitle></CardHeader>
            <CardContent><p className="text-sm font-medium mb-2">{brief.music_mood}</p>
              {musicSugs.map((m, i) => (<div key={i} className="flex items-center gap-2 text-xs text-muted-foreground rounded-md border border-zinc-800 px-2.5 py-1.5 mb-1"><Play className="h-3 w-3" />{m}</div>))}
            </CardContent>
          </Card>

          {thumbs.length > 0 && (
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Image className="h-4 w-4 text-emerald-500" /> Thumbnails</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {thumbs.map((t, i) => (<div key={i} className="rounded-md border border-zinc-800 p-3"><p className="text-sm font-medium mb-1">{t.text}</p><p className="text-xs text-muted-foreground">{t.concept}</p><p className="text-[10px] text-violet-400 mt-1">{t.style}</p></div>))}
              </CardContent>
            </Card>
          )}

          {brief.caption && (
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><FileText className="h-4 w-4 text-blue-500" /> Caption</CardTitle></CardHeader>
              <CardContent><p className="text-xs whitespace-pre-line text-muted-foreground">{brief.caption}</p></CardContent>
            </Card>
          )}

          {tags.length > 0 && (
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Hash className="h-4 w-4 text-amber-500" /> Hashtags</CardTitle></CardHeader>
              <CardContent><div className="flex flex-wrap gap-1.5">{tags.map((tag) => (<Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>))}</div></CardContent>
            </Card>
          )}

          {brief.editor_notes && (
            <Card className="border-yellow-500/20"><CardHeader className="pb-2"><CardTitle className="text-sm text-yellow-500">📝 Editor Notes</CardTitle></CardHeader>
              <CardContent><p className="text-xs text-muted-foreground">{brief.editor_notes}</p></CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
