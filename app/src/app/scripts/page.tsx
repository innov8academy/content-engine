"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PenTool, Search, Filter, Clock, FileText, Star } from "lucide-react";
import { mockScripts, channelMap } from "@/lib/mock-data";
import Link from "next/link";
import { motion } from "framer-motion";

const statusColors: Record<string, string> = {
  draft: "bg-zinc-500/20 text-zinc-400",
  review: "bg-yellow-500/20 text-yellow-400",
  approved: "bg-green-500/20 text-green-400",
  recorded: "bg-blue-500/20 text-blue-400",
  posted: "bg-emerald-500/20 text-emerald-400",
};

export default function ScriptsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Scripts</h1>
          <p className="text-sm text-muted-foreground">
            {mockScripts.length} scripts
          </p>
        </div>
        <Button size="sm" className="gap-1" variant="outline">
          <PenTool className="h-3.5 w-3.5" />
          New Script
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search scripts..." className="pl-9" />
        </div>
        <Button variant="outline" size="sm" className="gap-1">
          <Filter className="h-3.5 w-3.5" />
          Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockScripts.map((script, i) => {
          const channel = channelMap[script.channelId];
          return (
            <motion.div
              key={script.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/scripts/${script.id}`}>
                <Card className="cursor-pointer hover:border-zinc-600 transition-all group">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: channel?.color }} />
                        <span className="text-xs text-muted-foreground">{channel?.handle}</span>
                      </div>
                      <Badge variant="secondary" className={`text-[10px] ${statusColors[script.status]}`}>
                        {script.status}
                      </Badge>
                    </div>

                    <h3 className="text-sm font-medium mb-2 group-hover:text-white transition-colors">
                      {script.title}
                    </h3>

                    <p className="text-xs text-muted-foreground mb-4 line-clamp-2 italic">
                      &quot;{script.hook}&quot;
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {script.wordCount}w
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {script.estimatedDuration}s
                        </span>
                        <Badge variant="outline" className="text-[10px]">{script.template}</Badge>
                      </div>
                      {script.criticScore && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                          <span className="text-xs font-medium text-amber-500">
                            {script.criticScore.overall}
                          </span>
                        </div>
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
