"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function SearchBox() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim()) {
          router.push(`/search?q=${encodeURIComponent(value.trim())}`);
        }
      }}
      className="max-w-md"
    >
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search accounts, contacts, leads, opportunities..."
        className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800"
      />
    </form>
  );
}
