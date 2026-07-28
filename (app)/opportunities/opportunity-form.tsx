"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { OPPORTUNITY_STAGE_LABELS } from "@/lib/labels";

type Action = (
  prevState: { error?: string } | undefined,
  formData: FormData
) => Promise<{ error?: string }>;

export function OpportunityForm({
  action,
  users,
  accounts,
  contacts,
  defaultValues,
  submitLabel,
}: {
  action: Action;
  users: { id: string; name: string }[];
  accounts: { id: string; name: string }[];
  contacts: { id: string; firstName: string; lastName: string; accountId: string | null }[];
  defaultValues?: {
    name?: string;
    amount?: number | string;
    stage?: string;
    probability?: number;
    closeDate?: Date | string | null;
    description?: string | null;
    accountId?: string;
    contactId?: string | null;
    ownerId?: string;
  };
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  const closeDateValue = defaultValues?.closeDate
    ? new Date(defaultValues.closeDate).toISOString().slice(0, 10)
    : "";

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Opportunity name
        </label>
        <input
          name="name"
          required
          defaultValue={defaultValues?.name}
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Amount ($)
          </label>
          <input
            name="amount"
            type="number"
            min="0"
            step="1"
            required
            defaultValue={defaultValues?.amount?.toString() ?? "0"}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Stage
          </label>
          <select
            name="stage"
            defaultValue={defaultValues?.stage ?? "QUALIFICATION"}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            {Object.entries(OPPORTUNITY_STAGE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Probability (%)
          </label>
          <input
            name="probability"
            type="number"
            min="0"
            max="100"
            defaultValue={defaultValues?.probability ?? 10}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Close date
          </label>
          <input
            name="closeDate"
            type="date"
            defaultValue={closeDateValue}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Account
          </label>
          <select
            name="accountId"
            required
            defaultValue={defaultValues?.accountId ?? ""}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="" disabled>
              Select account
            </option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Contact
          </label>
          <select
            name="contactId"
            defaultValue={defaultValues?.contactId ?? ""}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="">No contact</option>
            {contacts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.firstName} {c.lastName}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Owner
        </label>
        <select
          name="ownerId"
          required
          defaultValue={defaultValues?.ownerId ?? ""}
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        >
          <option value="" disabled>
            Select owner
          </option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Description
        </label>
        <textarea
          name="description"
          rows={3}
          defaultValue={defaultValues?.description ?? ""}
          className="w-full resize-none rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
      </div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
