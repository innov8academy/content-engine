"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { CHANNELS } from "@/lib/constants";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

interface CalendarEntry {
  id: string;
  channel_id: string;
  scheduled_date: string;
  scheduled_time: string | null;
  status: string;
  script_id?: string;
  idea_id?: string;
  post_url?: string;
  created_at: string;
  // Relations
  scripts: {
    title: string;
    hook: string;
  } | null;
  ideas: {
    title: string;
  } | null;
}

export default function CalendarPage() {
  const [entries, setEntries] = useState<CalendarEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth] = useState(new Date(2026, 1)); // February 2026

  useEffect(() => {
    async function fetchCalendar() {
      const { data } = await supabase
        .from('calendar_entries')
        .select(`
          *,
          scripts(title, hook),
          ideas(title)
        `)
        .gte('scheduled_date', '2026-02-01')
        .lte('scheduled_date', '2026-02-29')
        .order('scheduled_date', { ascending: true });

      setEntries(data || []);
      setLoading(false);
    }
    fetchCalendar();
  }, []);

  const getEntriesForDate = (channelId: string, date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return entries.filter(e => 
      e.channel_id === channelId && 
      e.scheduled_date === dateStr
    );
  };

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dates = Array.from({ length: 28 }, (_, i) => i + 1); // February 2026 has 28 days

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      planned: 'bg-blue-500/20 text-blue-400',
      recording: 'bg-purple-500/20 text-purple-400',
      editing: 'bg-pink-500/20 text-pink-400',
      posted: 'bg-green-500/20 text-green-400',
    };
    return colors[status] || '';
  };

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
            {days.map((day, i) => {
              const date = new Date(2026, 1, dates[i]);
              const isToday = date.toDateString() === new Date(2026, 1, 23).toDateString();
              return (
                <div key={day} className="p-3 text-center border-r border-zinc-800 last:border-r-0">
                  <p className="text-xs text-muted-foreground">{day}</p>
                  <p className={`text-lg font-bold ${isToday ? 'text-blue-500' : ''}`}>{dates[i]}</p>
                </div>
              );
            })}
          </div>

          {/* Channel Rows */}
          {Object.values(CHANNELS).map((channel) => (
            <div key={channel.id} className="grid grid-cols-8 border-b border-zinc-800 last:border-b-0">
              <div className="p-3 border-r border-zinc-800 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: channel.color }} />
                <span className="text-xs font-medium">{channel.handle}</span>
              </div>
              {dates.map((dateNum, i) => {
                const date = new Date(2026, 1, dateNum);
                const dayEntries = getEntriesForDate(channel.id, date);
                
                return (
                  <div
                    key={`${channel.id}-${dateNum}`}
                    className="p-2 border-r border-zinc-800 last:border-r-0 min-h-[80px] hover:bg-zinc-900/50 cursor-pointer transition-colors"
                  >
                    {dayEntries.length > 0 ? (
                      dayEntries.map((entry) => (
                        <div
                          key={entry.id}
                          className="mb-2 last:mb-0"
                        >
                          <div className="rounded-md border border-zinc-700 p-2 hover:border-zinc-600 transition-colors">
                            {entry.scripts ? (
                              <>
                                <p className="text-xs font-medium truncate">{entry.scripts.title}</p>
                                <p className="text-[9px] text-muted-foreground line-clamp-1">"{entry.scripts.hook}"</p>
                              </>
                            ) : (
                              <p className="text-xs text-muted-foreground truncate">{entry.ideas?.title || 'Entry'}</p>
                            )}
                            {entry.scheduled_time && (
                              <p className="text-[9px] text-muted-foreground mt-1">
                                {entry.scheduled_time}
                              </p>
                            )}
                            <Badge
                              variant="secondary"
                              className={`text-[8px] mt-1 ${getStatusColor(entry.status)}`}
                            >
                              {entry.status}
                            </Badge>
                            {entry.post_url && (
                              <Badge
                                variant="outline"
                                className="text-[8px] mt-1 border-emerald-500/50 text-emerald-500"
                              >
                                Posted
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="h-full rounded-md border border-dashed border-zinc-800 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Plus className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-4">
        {Object.values(CHANNELS).map((channel) => {
          const channelPosts = entries.filter(e => e.channel_id === channel.id);
          const postedCount = channelPosts.filter(e => e.status === 'posted').length;
          
          return (
            <Card key={channel.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: channel.color }} />
                  {channel.handle}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{postedCount}/{channelPosts.length}</p>
                <p className="text-xs text-muted-foreground">posts this month</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-sm text-muted-foreground">Loading calendar...</div>
        </div>
      )}
    </div>
  );
}