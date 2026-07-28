import Link from "next/link";
import { SignupForm } from "./signup-form";

export default function SignupPage() {
  return (
    <div>
      <h1 className="mb-1 text-lg font-semibold text-slate-900 dark:text-white">
        Create your account
      </h1>
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        Start managing accounts, contacts, and deals.
      </p>
      <SignupForm />
      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
