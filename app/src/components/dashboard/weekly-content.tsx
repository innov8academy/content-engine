"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CHANNELS } from "@/lib/constants";

const channels = Object.values(CHANNELS);

export function WeeklyContent() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">This Week</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className="flex items-center gap-3 rounded-lg border border-zinc-800 p-3"
          >
            <div
              className="h-3 w-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: channel.color }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{channel.handle}</p>
              <p className="text-xs text-muted-foreground">No content planned</p>
            </div>
            <Badge variant="outline" className="text-xs text-muted-foreground">
              Empty
            </Badge>
          </div>
        ))}
        <div className="pt-2 text-center">
          <p className="text-xs text-muted-foreground">
            0/3 posts planned this week
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
