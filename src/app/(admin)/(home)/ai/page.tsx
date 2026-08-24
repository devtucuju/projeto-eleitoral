import { Metadata } from "next";
import AiRecentTransaction from "@/components/ai-dashboard/ai-recent-transaction";
import AiStats from "@/components/ai-dashboard/ai-stats";
import ApiToken from "@/components/ai-dashboard/api-token";
import ProjectAnalytics from "@/components/ai-dashboard/project-analytics";
import UserAnalytics from "@/components/ai-dashboard/user-analytics";
import UserRevenueAndStatistics from "@/components/ai-dashboard/user-revenue-and-statistics";

export const metadata: Metadata = {
  title: "Next.js AI Dashboard | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js AI Dashboard page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function AIDashboard() {
  return (
    <>
      <div className="space-y-6">
        <AiStats />
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="xl:col-span-8">
            <UserRevenueAndStatistics />
          </div>
          <div className="xl:col-span-4">
            <ApiToken />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <UserAnalytics />
          <ProjectAnalytics />
        </div>

        <AiRecentTransaction />
      </div>
    </>
  );
}
