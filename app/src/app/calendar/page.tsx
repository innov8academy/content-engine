"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { CHANNELS } from "@/lib/constants";

const channels = Object.values(CHANNELS);
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const dates = [24, 25, 26, 27, 28, 1, 2];

export default function CalendarPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Content Calendar</h1>
          <p className="text-sm text-muted-foreground">February 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">Today</Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button size="sm" className="gap-1 ml-2">
            <Plus className="h-3.5 w-3.5" />
            Schedule
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {/* Header */}
          <div className="grid grid-cols-8 border-b border-zinc-800">
            <div className="p-3 border-r border-zinc-800">
              <span className="text-xs font-medium text-muted-foreground">Channel</span>
            </div>
            {days.map((day, i) => (
              <div key={day} className="p-3 text-center border-r border-zinc-800 last:border-r-0">
                <p className="text-xs text-muted-foreground">{day}</p>
                <p className={`text-lg font-bold ${dates[i] === 26 ? 'text-blue-500' : ''}`}>{dates[i]}</p>
              </div>
            ))}
          </div>

          {/* Channel Rows */}
          {channels.map((channel) => (
            <div key={channel.id} className="grid grid-cols-8 border-b border-zinc-800 last:border-b-0">
              <div className="p-3 border-r border-zinc-800 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: channel.color }} />
                <span className="text-xs font-medium">{channel.handle}</span>
              </div>
              {days.map((day, i) => (
                <div
                  key={`${channel.id}-${day}`}
                  className="p-2 border-r border-zinc-800 last:border-r-0 min-h-[80px] hover:bg-zinc-900/50 cursor-pointer transition-colors"
                >
                  {/* Empty slot */}
                  <div className="h-full rounded-md border border-dashed border-zinc-800 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Plus className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        {channels.map((channel) => (
          <Card key={channel.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: channel.color }} />
                {channel.handle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">0/1</p>
              <p className="text-xs text-muted-foreground">posts this week</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
