import clsx from "clsx";

const COLOR_MAP: Record<string, string> = {
  slate: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  green: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  red: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  indigo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400",
  purple: "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
};

export function Badge({
  color = "slate",
  children,
}: {
  color?: keyof typeof COLOR_MAP;
  children: React.ReactNode;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        COLOR_MAP[color]
      )}
    >
      {children}
    </span>
  );
}
