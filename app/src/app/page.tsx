import { DashboardHeader } from "@/components/dashboard/header";
import { AgentGrid } from "@/components/dashboard/agent-grid";
import { PipelineKanban } from "@/components/dashboard/pipeline-kanban";
import { WeeklyContent } from "@/components/dashboard/weekly-content";
import { RecentActivity } from "@/components/dashboard/recent-activity";

export default function Dashboard() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <DashboardHeader />
      <AgentGrid />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PipelineKanban />
        </div>
        <div>
          <WeeklyContent />
        </div>
      </div>
      <RecentActivity />
    </div>
  );
}
