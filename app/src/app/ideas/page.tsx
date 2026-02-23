"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Search, Filter, TrendingUp, Loader2 } from "lucide-react";
import { useIdeas } from "@/hooks/use-ideas";
import Link from "next/link";
import { motion } from "framer-motion";

const channelMap: Record<string, { name: string; handle: string; color: string }> = {
  innov8ai: { name: 'Innov8 AI', handle: '@innov8.ai', color: '#3B82F6' },
  alextom: { name: 'Alex Tom AI', handle: '@alextom.ai', color: '#8B5CF6' },
  academy: { name: 'Innov8 Academy', handle: '@innov8.academy', color: '#10B981' },
};

const statusColors: Record<string, string> = {
  raw: "bg-zinc-500/20 text-zinc-400",
  developed: "bg-yellow-500/20 text-yellow-400",
  scripted: "bg-blue-500/20 text-blue-400",
  used: "bg-green-500/20 text-green-400",
  archived: "bg-zinc-700/20 text-zinc-500",
};

export default function IdeasPage() {
  const { ideas, loading, generateIdeas } = useIdeas();
  const [generating, setGenerating] = useState(false);
  const [genChannel, setGenChannel] = useState("innov8ai");
  const [genTopic, setGenTopic] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await generateIdeas(genChannel, genTopic || undefined, 5);
      setDialogOpen(false);
      setGenTopic("");
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const filteredIdeas = ideas.filter((idea) =>
    !searchQuery || idea.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Idea Bank</h1>
          <p className="text-sm text-muted-foreground">
            {ideas.length} ideas across all channels
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
              <Sparkles className="h-3.5 w-3.5" />
              Generate Ideas
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>🔍 Scout — Generate Ideas</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Channel</label>
                <Select value={genChannel} onValueChange={setGenChannel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(channelMap).map(([id, ch]) => (
                      <SelectItem key={id} value={id}>
                        <span className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full inline-block" style={{ backgroundColor: ch.color }} />
                          {ch.handle}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Topic (optional)</label>
                <Textarea
                  placeholder="e.g., AI coding tools, content creation, trending AI news..."
                  value={genTopic}
                  onChange={(e) => setGenTopic(e.target.value)}
                  rows={3}
                />
              </div>
              <Button
                className="w-full gap-2"
                onClick={handleGenerate}
                disabled={generating}
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Scout is researching...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate 5 Ideas
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search ideas..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-1">
          {Object.values(channelMap).map((ch) => (
            <button
              key={ch.handle}
              className="flex h-8 items-center gap-1.5 rounded-md border border-zinc-800 px-2.5 text-xs hover:bg-accent transition-colors"
            >
              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: ch.color }} />
              {ch.handle}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filteredIdeas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Sparkles className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-1">No ideas yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Click &quot;Generate Ideas&quot; to let Scout find trending content opportunities.
          </p>
          <Button onClick={() => setDialogOpen(true)} className="gap-1">
            <Sparkles className="h-3.5 w-3.5" />
            Generate Ideas
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIdeas.map((idea, i) => {
            const channel = channelMap[idea.channel_id];
            return (
              <motion.div
                key={idea.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link href={`/ideas/${idea.id}`}>
                  <Card className="cursor-pointer hover:border-zinc-600 transition-all group">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: channel?.color || '#888' }}
                          />
                          <span className="text-xs text-muted-foreground">{channel?.handle || idea.channel_id}</span>
                        </div>
                        <Badge variant="secondary" className={`text-[10px] ${statusColors[idea.status] || ''}`}>
                          {idea.status}
                        </Badge>
                      </div>

                      <h3 className="text-sm font-medium mb-2 line-clamp-2 group-hover:text-white transition-colors">
                        {idea.title}
                      </h3>

                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                        {idea.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px]">
                            {idea.format}
                          </Badge>
                          {(idea.tags || []).slice(0, 2).map((tag: string) => (
                            <Badge key={tag} variant="outline" className="text-[10px] text-muted-foreground">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-amber-500" />
                          <span className="text-xs font-medium text-amber-500">{idea.virality_score}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
