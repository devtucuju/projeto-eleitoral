import SalesChannel from "@/components/sales/sales-channel";
import SalesChannelCountry from "@/components/sales/sales-channel-country";
import SalesStats from "@/components/sales/sales-stats";
import TopProductTable from "@/components/sales/top-product";
import UserRetentionHeatmap from "@/components/sales/user-retention-heatmap";
import UserRevenueAndStats from "@/components/sales/user-revenue-and-stats-chart";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js Sales Dashboard | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Sales Dashboard page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function SalesDashboard() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <SalesStats />
      </div>

      <div className="col-span-12">
        <UserRevenueAndStats />
      </div>

      <div className="col-span-12">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
          <UserRetentionHeatmap />
          <SalesChannel />
          <SalesChannelCountry />
        </div>
      </div>

      <div className="col-span-12">
        <TopProductTable />
      </div>
    </div>
  );
}
