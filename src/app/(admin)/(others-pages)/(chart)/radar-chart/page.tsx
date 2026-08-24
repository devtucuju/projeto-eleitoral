import RadarChartOne from "@/components/charts/radar/RadarChartOne";
import RadarChartThree from "@/components/charts/radar/RadarChartThree";
import RadarChartTwo from "@/components/charts/radar/RadarChartTwo";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js Pie Chart | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Pie Chart page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function RadarChart() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Radar Chart" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ComponentCard title="Radar Chart 1">
          <RadarChartOne />
        </ComponentCard>
        <ComponentCard title="Radar Chart 2">
          <RadarChartTwo />
        </ComponentCard>
        <ComponentCard title="Radar Chart 3">
          <RadarChartThree />
        </ComponentCard>
      </div>
    </div>
  );
}
