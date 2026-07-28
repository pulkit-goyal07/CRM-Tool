import { prisma } from "@/lib/prisma";

export async function getDashboardData() {
  const [
    accountCount,
    contactCount,
    openLeadCount,
    openOpportunities,
    stageBreakdown,
    leadBreakdown,
    upcomingTasks,
    recentActivity,
    closedWonCount,
    closedLostCount,
  ] = await Promise.all([
    prisma.account.count(),
    prisma.contact.count(),
    prisma.lead.count({
      where: { status: { notIn: ["CONVERTED", "DISQUALIFIED"] } },
    }),
    prisma.opportunity.findMany({
      where: { stage: { notIn: ["CLOSED_WON", "CLOSED_LOST"] } },
      select: { amount: true },
    }),
    prisma.opportunity.groupBy({
      by: ["stage"],
      _count: { _all: true },
      _sum: { amount: true },
    }),
    prisma.lead.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    prisma.task.findMany({
      where: { status: { not: "DONE" } },
      orderBy: { dueDate: "asc" },
      take: 5,
      include: { assignee: { select: { name: true } } },
    }),
    prisma.activity.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        author: { select: { name: true } },
        account: { select: { name: true } },
        contact: { select: { firstName: true, lastName: true } },
        lead: { select: { firstName: true, lastName: true } },
        opportunity: { select: { name: true } },
      },
    }),
    prisma.opportunity.count({ where: { stage: "CLOSED_WON" } }),
    prisma.opportunity.count({ where: { stage: "CLOSED_LOST" } }),
  ]);

  const pipelineValue = openOpportunities.reduce(
    (sum, o) => sum + Number(o.amount),
    0
  );

  const closedTotal = closedWonCount + closedLostCount;
  const winRate = closedTotal === 0 ? 0 : (closedWonCount / closedTotal) * 100;

  return {
    accountCount,
    contactCount,
    openLeadCount,
    openOpportunityCount: openOpportunities.length,
    pipelineValue,
    winRate,
    stageBreakdown: stageBreakdown.map((s) => ({
      stage: s.stage,
      count: s._count._all,
      amount: Number(s._sum.amount ?? 0),
    })),
    leadBreakdown: leadBreakdown.map((l) => ({
      status: l.status,
      count: l._count._all,
    })),
    upcomingTasks,
    recentActivity,
  };
}

export async function searchAll(query: string) {
  if (!query.trim()) {
    return { accounts: [], contacts: [], leads: [], opportunities: [] };
  }

  const [accounts, contacts, leads, opportunities] = await Promise.all([
    prisma.account.findMany({
      where: { name: { contains: query, mode: "insensitive" } },
      take: 10,
    }),
    prisma.contact.findMany({
      where: {
        OR: [
          { firstName: { contains: query, mode: "insensitive" } },
          { lastName: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 10,
    }),
    prisma.lead.findMany({
      where: {
        OR: [
          { firstName: { contains: query, mode: "insensitive" } },
          { lastName: { contains: query, mode: "insensitive" } },
          { company: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 10,
    }),
    prisma.opportunity.findMany({
      where: { name: { contains: query, mode: "insensitive" } },
      take: 10,
    }),
  ]);

  return { accounts, contacts, leads, opportunities };
}
