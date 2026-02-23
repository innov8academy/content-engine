"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RecentActivity() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
          No activity yet. Run your first pipeline to get started.
        </div>
      </CardContent>
    </Card>
  );
}
