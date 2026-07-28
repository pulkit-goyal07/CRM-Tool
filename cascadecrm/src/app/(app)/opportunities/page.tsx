import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/page-header";
import { LinkButton } from "@/components/ui/button";
import { KanbanBoard } from "./kanban-board";

export default async function OpportunitiesPage() {
  const opportunities = await prisma.opportunity.findMany({
    include: { account: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const cards = opportunities.map((o) => ({
    id: o.id,
    name: o.name,
    amount: Number(o.amount),
    stage: o.stage,
    account: o.account,
  }));

  return (
    <div>
      <PageHeader
        title="Opportunities"
        description="Drag cards between stages to update your pipeline."
        action={<LinkButton href="/opportunities/new">New Opportunity</LinkButton>}
      />
      <KanbanBoard opportunities={cards} />
    </div>
  );
}
