import { signOut } from "@/lib/auth";
import { SearchBox } from "@/components/search-box";

export function TopBar({
  name,
  email,
}: {
  name?: string | null;
  email?: string | null;
}) {
  const initials = (name ?? email ?? "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="flex h-14 items-center gap-4 border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900 md:px-6">
      <div className="flex-1">
        <SearchBox />
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right leading-tight">
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            {name}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {email}
          </p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
          {initials}
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button
            type="submit"
            className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
