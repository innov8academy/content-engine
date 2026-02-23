"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, PenTool, Sparkles, TrendingUp, Target, Users, Lightbulb } from "lucide-react";
import { mockIdeas, channelMap } from "@/lib/mock-data";
import Link from "next/link";
import { use } from "react";

export default function IdeaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const idea = mockIdeas.find((i) => i.id === id) || mockIdeas[0];
  const channel = channelMap[idea.channelId];

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
          </div>
          <h1 className="text-xl font-bold">{idea.title}</h1>
        </div>
        <Button className="gap-1 bg-gradient-to-r from-blue-500 to-violet-500">
          <PenTool className="h-3.5 w-3.5" />
          Script This
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-5 w-5 mx-auto mb-1 text-amber-500" />
            <p className="text-2xl font-bold text-amber-500">{idea.viralityScore}</p>
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

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-500" />
            Hook Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {idea.hooks.map((hook, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border border-zinc-800 p-3 hover:border-zinc-600 cursor-pointer transition-colors">
              <span className="text-xs text-muted-foreground mt-0.5">#{i + 1}</span>
              <p className="text-sm font-medium">{hook}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Key Points</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {idea.keyPoints.map((point, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                {point}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Target Audience</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{idea.targetAudience}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">CTA Strategy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">{idea.ctaStrategy}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {idea.tags.map((tag) => (
          <Badge key={tag} variant="outline">{tag}</Badge>
        ))}
      </div>
    </div>
  );
}
