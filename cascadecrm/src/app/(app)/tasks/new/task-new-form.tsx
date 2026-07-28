"use client";

import { useActionState, useState } from "react";
import { createTaskAction } from "@/actions/task";
import { Button } from "@/components/ui/button";

type Option = { id: string; label: string };

export function TaskNewForm({
  users,
  accounts,
  contacts,
  leads,
  opportunities,
}: {
  users: Option[];
  accounts: Option[];
  contacts: Option[];
  leads: Option[];
  opportunities: Option[];
}) {
  const [state, formAction, pending] = useActionState(createTaskAction, undefined);
  const [relatedType, setRelatedType] = useState<
    "none" | "account" | "contact" | "lead" | "opportunity"
  >("none");

  const relatedOptions: Record<string, Option[]> = {
    account: accounts,
    contact: contacts,
    lead: leads,
    opportunity: opportunities,
  };

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <input type="hidden" name="path" value="/tasks" />
      <input type="hidden" name="redirectTo" value="/tasks" />
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Title
        </label>
        <input
          name="title"
          required
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Description
        </label>
        <textarea
          name="description"
          rows={3}
          className="w-full resize-none rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Due date
          </label>
          <input
            name="dueDate"
            type="date"
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Priority
          </label>
          <select
            name="priority"
            defaultValue="NORMAL"
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="LOW">Low</option>
            <option value="NORMAL">Normal</option>
            <option value="HIGH">High</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Assignee
          </label>
          <select
            name="assigneeId"
            required
            defaultValue=""
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="" disabled>
              Select
            </option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Relates to
        </label>
        <select
          value={relatedType}
          onChange={(e) => setRelatedType(e.target.value as never)}
          className="mb-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        >
          <option value="none">Nothing</option>
          <option value="account">Account</option>
          <option value="contact">Contact</option>
          <option value="lead">Lead</option>
          <option value="opportunity">Opportunity</option>
        </select>
        {relatedType !== "none" && (
          <select
            name={`${relatedType}Id`}
            required
            defaultValue=""
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="" disabled>
              Select {relatedType}
            </option>
            {relatedOptions[relatedType].map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Creating..." : "Create Task"}
      </Button>
    </form>
  );
}
