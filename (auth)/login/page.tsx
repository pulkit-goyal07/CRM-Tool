import Link from "next/link";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <div>
      <h1 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">
        Sign in
      </h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        Welcome back. Enter your credentials to continue.
      </p>
      <LoginForm callbackUrl={callbackUrl ?? "/"} />
      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Sign up
        </Link>
      </p>
      <p className="mt-4 rounded-md bg-slate-50 p-3 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        Demo login: <code>admin@crm.dev</code> / <code>password123</code>
      </p>
    </div>
  );
}
