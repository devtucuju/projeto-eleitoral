import CashflowOverview from "@/components/finance-dashboard/CashflowOverview";
import FinanceStats from "@/components/finance-dashboard/FinanceStats";
import FinanceTransactionTable from "@/components/finance-dashboard/FinanceTransactionTable";
import MyCards from "@/components/finance-dashboard/MyCards";
import QuickSend from "@/components/finance-dashboard/QuickSend";
import SpendingWidget from "@/components/finance-dashboard/SpendingWidget";
import TotalBalanceOverview from "@/components/finance-dashboard/TotalBalanceOverview";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js Finance Dashboard | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Finance Dashboard page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function FinanceDashboard() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="xl:col-span-6 2xl:col-span-5">
          <TotalBalanceOverview />
        </div>
        <div className="xl:col-span-6 2xl:col-span-7">
          <FinanceStats />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className="col-span-12 space-y-5 xl:col-span-8">
          <CashflowOverview />
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <SpendingWidget />
            <QuickSend />
          </div>
        </div>
        <div className="col-span-12 xl:col-span-4">
          <MyCards />
        </div>
      </div>
      <FinanceTransactionTable />
    </div>
  );
}
