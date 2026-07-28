import Link from "next/link";
import clsx from "clsx";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import {
  LEAD_SOURCE_LABELS,
  LEAD_STATUS_COLORS,
  LEAD_STATUS_LABELS,
} from "@/lib/labels";

const STATUS_FILTERS = ["ALL", ...Object.keys(LEAD_STATUS_LABELS)];

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus = status && STATUS_FILTERS.includes(status) ? status : "ALL";

  const leads = await prisma.lead.findMany({
    where: activeStatus === "ALL" ? undefined : { status: activeStatus as never },
    include: { owner: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Leads"
        description="Prospective customers to qualify and convert."
        action={<LinkButton href="/leads/new">New Lead</LinkButton>}
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((s) => (
          <Link
            key={s}
            href={s === "ALL" ? "/leads" : `/leads?status=${s}`}
            className={clsx(
              "rounded-full px-3 py-1 text-xs font-medium transition",
              activeStatus === s
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            )}
          >
            {s === "ALL" ? "All" : LEAD_STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
            <tr>
              <th className="px-4 py-2.5">Name</th>
              <th className="px-4 py-2.5">Company</th>
              <th className="px-4 py-2.5">Status</th>
              <th className="px-4 py-2.5">Source</th>
              <th className="px-4 py-2.5">Owner</th>
              <th className="px-4 py-2.5">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-4 py-3">
                  <Link
                    href={`/leads/${lead.id}`}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    {lead.firstName} {lead.lastName}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  {lead.company ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <Badge color={LEAD_STATUS_COLORS[lead.status] as never}>
                    {LEAD_STATUS_LABELS[lead.status]}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  {LEAD_SOURCE_LABELS[lead.source]}
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  {lead.owner.name}
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  {formatDate(lead.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads.length === 0 && (
          <p className="py-10 text-center text-sm text-slate-400">
            No leads found.
          </p>
        )}
      </Card>
    </div>
  );
}
