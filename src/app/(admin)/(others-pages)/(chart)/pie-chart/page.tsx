import PieChartFive from "@/components/charts/pie/PieChartFive";
import PieChartFour from "@/components/charts/pie/PieChartFour";
import PieChartOne from "@/components/charts/pie/PieChartOne";
import PieChartThree from "@/components/charts/pie/PieChartThree";
import PieChartTwo from "@/components/charts/pie/PieChartTwo";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js Pie Chart | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Pie Chart page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function PieChart() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Pie Chart" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ComponentCard title="Donut Pie Chart 1">
          <PieChartOne />
        </ComponentCard>
        <ComponentCard title="Donut Pie Chart 2">
          <PieChartTwo />
        </ComponentCard>
        <ComponentCard title="Donut Pie Chart 3">
          <PieChartThree />
        </ComponentCard>
        <ComponentCard title="Donut Pie Chart 4">
          <PieChartFour />
        </ComponentCard>
        <ComponentCard title="Donut Pie Chart 5">
          <PieChartFive />
        </ComponentCard>
      </div>
    </div>
  );
}
