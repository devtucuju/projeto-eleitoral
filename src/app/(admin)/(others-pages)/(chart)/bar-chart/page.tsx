import BarChartFive from "@/components/charts/bar/BarChartFive";
import BarChartFour from "@/components/charts/bar/BarChartFour";
import BarChartOne from "@/components/charts/bar/BarChartOne";
import BarChartSix from "@/components/charts/bar/BarChartSix";
import BarChartThree from "@/components/charts/bar/BarChartThree";
import BarChartTwo from "@/components/charts/bar/BarChartTwo";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js Bar Chart | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Bar Chart page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function page() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Bar Chart" />
      <div className="space-y-6 overflow-x-hidden">
        <ComponentCard title="Bar Chart 1">
          <BarChartOne />
        </ComponentCard>
        <ComponentCard title="Bar Chart 2">
          <BarChartTwo />
        </ComponentCard>
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 ">
          <ComponentCard title="Bar Chart 3">
            <BarChartThree />
          </ComponentCard>{" "}
          <ComponentCard title="Horizontal Bar Chart">
            <BarChartFour />
          </ComponentCard>
          <ComponentCard title="Bar Chart 5">
            <BarChartFive />
          </ComponentCard>
          <ComponentCard title="Bar Chart 6">
            <BarChartSix />
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}
