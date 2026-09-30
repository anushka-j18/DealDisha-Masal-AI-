import DashboardPage from '../../page';

export default async function LeadDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DashboardPage initialLeadId={id} />;
}
