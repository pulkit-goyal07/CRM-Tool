import clsx from "clsx";
import Link from "next/link";

const VARIANTS = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-60",
  secondary:
    "border border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
  danger: "bg-red-600 text-white hover:bg-red-500 disabled:opacity-60",
  ghost:
    "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
};

const BASE =
  "inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition";

export function Button({
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof VARIANTS;
}) {
  return (
    <button className={clsx(BASE, VARIANTS[variant], className)} {...props} />
  );
}

export function LinkButton({
  variant = "primary",
  className,
  href,
  children,
}: {
  variant?: keyof typeof VARIANTS;
  className?: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={clsx(BASE, VARIANTS[variant], className)}>
      {children}
    </Link>
  );
}
