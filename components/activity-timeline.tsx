import { addActivityAction } from "@/actions/activity";
import { formatDate } from "@/lib/format";
import { ACTIVITY_TYPE_LABELS } from "@/lib/labels";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ActivityItem = {
  id: string;
  type: string;
  body: string;
  createdAt: Date;
  author: { name: string };
};

export function ActivityTimeline({
  activities,
  path,
  ...ids
}: {
  activities: ActivityItem[];
  path: string;
  accountId?: string;
  contactId?: string;
  leadId?: string;
  opportunityId?: string;
}) {
  return (
    <Card className="p-4">
      <h2 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
        Activity
      </h2>
      <form action={addActivityAction} className="mb-4 space-y-2">
        <input type="hidden" name="path" value={path} />
        {ids.accountId && (
          <input type="hidden" name="accountId" value={ids.accountId} />
        )}
        {ids.contactId && (
          <input type="hidden" name="contactId" value={ids.contactId} />
        )}
        {ids.leadId && <input type="hidden" name="leadId" value={ids.leadId} />}
        {ids.opportunityId && (
          <input type="hidden" name="opportunityId" value={ids.opportunityId} />
        )}
        <div className="flex gap-2">
          <select
            name="type"
            defaultValue="NOTE"
            className="rounded-md border border-slate-200 bg-white px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            {Object.entries(ACTIVITY_TYPE_LABELS)
              .filter(([key]) => key !== "STAGE_CHANGE" && key !== "CONVERSION")
              .map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
          </select>
          <textarea
            name="body"
            required
            rows={2}
            placeholder="Log a note, call, or email..."
            className="flex-1 resize-none rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" variant="secondary" className="text-xs">
            Log activity
          </Button>
        </div>
      </form>

      {activities.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400">
          No activity yet.
        </p>
      ) : (
        <ul className="space-y-3 border-l border-slate-200 pl-4 dark:border-slate-800">
          {activities.map((activity) => (
            <li key={activity.id} className="relative">
              <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-indigo-500" />
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {ACTIVITY_TYPE_LABELS[activity.type] ?? activity.type} ·{" "}
                {activity.author.name} · {formatDate(activity.createdAt)}
              </p>
              <p className="text-sm text-slate-800 dark:text-slate-200">
                {activity.body}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
