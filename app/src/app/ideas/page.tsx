"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lightbulb, Sparkles, Search, Filter, TrendingUp } from "lucide-react";
import { mockIdeas, channelMap } from "@/lib/mock-data";
import Link from "next/link";
import { motion } from "framer-motion";

const statusColors: Record<string, string> = {
  raw: "bg-zinc-500/20 text-zinc-400",
  developed: "bg-yellow-500/20 text-yellow-400",
  scripted: "bg-blue-500/20 text-blue-400",
  used: "bg-green-500/20 text-green-400",
  archived: "bg-zinc-700/20 text-zinc-500",
};

export default function IdeasPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Idea Bank</h1>
          <p className="text-sm text-muted-foreground">
            {mockIdeas.length} ideas across all channels
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="gap-1">
            <TrendingUp className="h-3.5 w-3.5" />
            Scan Trends
          </Button>
          <Button size="sm" className="gap-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
            <Sparkles className="h-3.5 w-3.5" />
            Generate Ideas
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search ideas..." className="pl-9" />
        </div>
        <Button variant="outline" size="sm" className="gap-1">
          <Filter className="h-3.5 w-3.5" />
          Filters
        </Button>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockIdeas.map((idea, i) => {
          const channel = channelMap[idea.channelId];
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
                          style={{ backgroundColor: channel?.color }}
                        />
                        <span className="text-xs text-muted-foreground">{channel?.handle}</span>
                      </div>
                      <Badge variant="secondary" className={`text-[10px] ${statusColors[idea.status]}`}>
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
                        {idea.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-[10px] text-muted-foreground">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-amber-500" />
                        <span className="text-xs font-medium text-amber-500">{idea.viralityScore}</span>
                      </div>
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
