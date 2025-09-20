import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ type?: string }>;
}

export default async function AllocationAdminDashboardPage({
  searchParams,
}: PageProps) {
  const { type } = await searchParams;

  if (type) {
    redirect(`/allocation-admin/dashboard/overview?type=${type}`);
  }

  redirect("/allocation-admin/dashboard/overview");
}
