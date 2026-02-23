"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClipboardList, Search, Filter, Film, Music, Image } from "lucide-react";
import { mockBriefs, channelMap } from "@/lib/mock-data";
import Link from "next/link";
import { motion } from "framer-motion";

const statusColors: Record<string, string> = {
  draft: "bg-zinc-500/20 text-zinc-400",
  sent: "bg-blue-500/20 text-blue-400",
  completed: "bg-green-500/20 text-green-400",
};

export default function BriefsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Editor Briefs</h1>
          <p className="text-sm text-muted-foreground">
            {mockBriefs.length} briefs
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search briefs..." className="pl-9" />
        </div>
        <Button variant="outline" size="sm" className="gap-1">
          <Filter className="h-3.5 w-3.5" />
          Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockBriefs.map((brief, i) => {
          const channel = channelMap[brief.channelId];
          return (
            <motion.div
              key={brief.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/briefs/${brief.id}`}>
                <Card className="cursor-pointer hover:border-zinc-600 transition-all group">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: channel?.color }} />
                        <span className="text-xs text-muted-foreground">{channel?.handle}</span>
                      </div>
                      <Badge variant="secondary" className={`text-[10px] ${statusColors[brief.status]}`}>
                        {brief.status}
                      </Badge>
                    </div>

                    <h3 className="text-sm font-medium mb-3 group-hover:text-white transition-colors">
                      Editor Brief for Script #{brief.scriptId}
                    </h3>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Film className="h-3 w-3" />
                        {brief.scenes.length} scenes
                      </span>
                      <span className="flex items-center gap-1">
                        <Music className="h-3 w-3" />
                        {brief.musicMood?.split(',')[0]}
                      </span>
                      <span className="flex items-center gap-1">
                        <Image className="h-3 w-3" />
                        {brief.thumbnailConcepts.length} thumbnails
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {brief.hashtags.slice(0, 4).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-[10px]">{tag}</Badge>
                      ))}
                      {brief.hashtags.length > 4 && (
                        <span className="text-[10px] text-muted-foreground">+{brief.hashtags.length - 4}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
