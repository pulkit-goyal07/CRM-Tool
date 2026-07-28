"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { convertLeadAction } from "../actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Converting..." : "Convert Lead"}
    </Button>
  );
}

export function ConvertForm({
  leadId,
  leadCompany,
  accounts,
  users,
  currentUserId,
}: {
  leadId: string;
  leadCompany: string | null;
  accounts: { id: string; name: string }[];
  users: { id: string; name: string }[];
  currentUserId: string;
}) {
  const [state, formAction] = useActionState(convertLeadAction, undefined);
  const [accountMode, setAccountMode] = useState<"existing" | "new">(
    accounts.length > 0 ? "existing" : "new"
  );
  const [createOpportunity, setCreateOpportunity] = useState(true);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="leadId" value={leadId} />

      <div>
        <p className="mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">
          Account
        </p>
        <div className="mb-2 flex gap-4 text-sm">
          <label className="flex items-center gap-1.5">
            <input
              type="radio"
              checked={accountMode === "existing"}
              onChange={() => setAccountMode("existing")}
              disabled={accounts.length === 0}
            />
            Use existing
          </label>
          <label className="flex items-center gap-1.5">
            <input
              type="radio"
              checked={accountMode === "new"}
              onChange={() => setAccountMode("new")}
            />
            Create new
          </label>
        </div>
        {accountMode === "existing" ? (
          <select
            name="accountId"
            required
            defaultValue=""
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
        ) : (
          <input
            name="newAccountName"
            defaultValue={leadCompany ?? ""}
            placeholder="New account name"
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
          Owner for new records
        </label>
        <select
          name="ownerId"
          required
          defaultValue={currentUserId}
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        >
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
        <input
          type="checkbox"
          name="createOpportunity"
          checked={createOpportunity}
          onChange={(e) => setCreateOpportunity(e.target.checked)}
        />
        Also create an opportunity
      </label>

      {createOpportunity && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Opportunity name
            </label>
            <input
              name="opportunityName"
              placeholder={`${leadCompany ?? "New"} - New Business`}
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Amount
            </label>
            <input
              name="opportunityAmount"
              type="number"
              min="0"
              step="1"
              placeholder="0"
              className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>
      )}

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <SubmitButton />
    </form>
  );
}
