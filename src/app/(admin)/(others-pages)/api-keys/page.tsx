import ApiKeyTable from "@/components/api-keys/ApiKeyTable";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Keys | TailAdmin - Next.js Admin Dashboard Template",
  description: "Securely manage and monitor your API keys for third-party integrations in TailAdmin.",
};

export default function ApiKeysPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="API Keys" />
      <ApiKeyTable />
    </div>
  );
}
