"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import clsx from "clsx";
import { setOpportunityStageAction } from "./actions";
import { OPPORTUNITY_STAGES, OPPORTUNITY_STAGE_LABELS } from "@/lib/labels";
import { formatCurrency } from "@/lib/format";

type OpportunityCard = {
  id: string;
  name: string;
  amount: number;
  stage: string;
  account: { name: string };
};

export function KanbanBoard({
  opportunities,
}: {
  opportunities: OpportunityCard[];
}) {
  const [items, setItems] = useState(opportunities);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function moveTo(id: string, stage: string) {
    setItems((prev) =>
      prev.map((o) => (o.id === id ? { ...o, stage } : o))
    );
    startTransition(async () => {
      await setOpportunityStageAction(id, stage);
    });
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {OPPORTUNITY_STAGES.map((stage) => {
        const columnItems = items.filter((o) => o.stage === stage);
        const columnTotal = columnItems.reduce((sum, o) => sum + o.amount, 0);

        return (
          <div
            key={stage}
            onDragOver={(e) => {
              e.preventDefault();
              setOverStage(stage);
            }}
            onDragLeave={() => setOverStage((s) => (s === stage ? null : s))}
            onDrop={(e) => {
              e.preventDefault();
              setOverStage(null);
              if (dragId) moveTo(dragId, stage);
            }}
            className={clsx(
              "flex w-64 shrink-0 flex-col rounded-lg border bg-slate-50 dark:bg-slate-900/50",
              overStage === stage
                ? "border-indigo-400 ring-2 ring-indigo-200 dark:ring-indigo-500/30"
                : "border-slate-200 dark:border-slate-800"
            )}
          >
            <div className="border-b border-slate-200 p-3 dark:border-slate-800">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {OPPORTUNITY_STAGE_LABELS[stage]}
              </p>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {columnItems.length} · {formatCurrency(columnTotal)}
              </p>
            </div>
            <div className="flex-1 space-y-2 p-2">
              {columnItems.map((opp) => (
                <div
                  key={opp.id}
                  draggable
                  onDragStart={() => setDragId(opp.id)}
                  onDragEnd={() => setDragId(null)}
                  className="cursor-grab rounded-md border border-slate-200 bg-white p-3 shadow-sm active:cursor-grabbing dark:border-slate-700 dark:bg-slate-800"
                >
                  <Link
                    href={`/opportunities/${opp.id}`}
                    className="text-sm font-medium text-slate-800 hover:text-indigo-600 dark:text-slate-200"
                  >
                    {opp.name}
                  </Link>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {opp.account.name}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {formatCurrency(opp.amount)}
                  </p>
                </div>
              ))}
              {columnItems.length === 0 && (
                <p className="p-3 text-center text-xs text-slate-400">
                  Drop here
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
