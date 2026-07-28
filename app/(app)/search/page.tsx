import Link from "next/link";
import { searchAll } from "@/lib/queries";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import { OPPORTUNITY_STAGE_COLORS, OPPORTUNITY_STAGE_LABELS } from "@/lib/labels";

function ResultSection({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-4">
      <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
        {title} ({count})
      </h2>
      {count === 0 ? (
        <p className="text-sm text-slate-400">No matches.</p>
      ) : (
        <ul className="space-y-2">{children}</ul>
      )}
    </Card>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const results = q ? await searchAll(q) : null;

  return (
    <div>
      <PageHeader
        title="Search"
        description={q ? `Results for "${q}"` : "Enter a search term above."}
      />

      {results && (
        <div className="grid gap-4 lg:grid-cols-2">
          <ResultSection title="Accounts" count={results.accounts.length}>
            {results.accounts.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/accounts/${a.id}`}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  {a.name}
                </Link>
                {a.industry && (
                  <span className="ml-1 text-xs text-slate-400">· {a.industry}</span>
                )}
              </li>
            ))}
          </ResultSection>

          <ResultSection title="Contacts" count={results.contacts.length}>
            {results.contacts.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/contacts/${c.id}`}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  {c.firstName} {c.lastName}
                </Link>
                {c.email && (
                  <span className="ml-1 text-xs text-slate-400">· {c.email}</span>
                )}
              </li>
            ))}
          </ResultSection>

          <ResultSection title="Leads" count={results.leads.length}>
            {results.leads.map((l) => (
              <li key={l.id}>
                <Link
                  href={`/leads/${l.id}`}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  {l.firstName} {l.lastName}
                </Link>
                {l.company && (
                  <span className="ml-1 text-xs text-slate-400">· {l.company}</span>
                )}
              </li>
            ))}
          </ResultSection>

          <ResultSection title="Opportunities" count={results.opportunities.length}>
            {results.opportunities.map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-2">
                <Link
                  href={`/opportunities/${o.id}`}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  {o.name}
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">
                    {formatCurrency(Number(o.amount))}
                  </span>
                  <Badge color={OPPORTUNITY_STAGE_COLORS[o.stage] as never}>
                    {OPPORTUNITY_STAGE_LABELS[o.stage]}
                  </Badge>
                </div>
              </li>
            ))}
          </ResultSection>
        </div>
      )}
    </div>
  );
}
