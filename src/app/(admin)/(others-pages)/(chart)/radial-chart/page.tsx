import RadarChartOne from "@/components/charts/radar/RadarChartOne";
import RadarChartThree from "@/components/charts/radar/RadarChartThree";
import RadarChartTwo from "@/components/charts/radar/RadarChartTwo";
import RadialChartFour from "@/components/charts/radial/RadialChartFour";
import RadialChartOne from "@/components/charts/radial/RadialChartOne";
import RadialChartThree from "@/components/charts/radial/RadialChartThree";
import RadialChartTwo from "@/components/charts/radial/RadialChartTwo";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js Pie Chart | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Pie Chart page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function RadialChart() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Radial Chart" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ComponentCard title="Radial Chart 1">
          <RadialChartOne />
        </ComponentCard>
        <ComponentCard title="Radar Chart 2">
          <RadialChartTwo />
        </ComponentCard>
        <ComponentCard title="Radar Chart 3">
          <RadialChartThree />
        </ComponentCard>{" "}
        <ComponentCard title="Radar Chart ">
          <RadialChartFour />
        </ComponentCard>
      </div>
    </div>
  );
}
