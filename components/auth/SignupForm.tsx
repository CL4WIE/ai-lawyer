"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Scale } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ThemeToggle";

export function SignupForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (!signInRes || signInRes.error) {
        setError("Account created, but sign-in failed. Please sign in manually.");
        router.push("/login");
        return;
      }
      router.push("/chat");
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-canvas px-4">
      <ThemeToggle className="absolute right-4 top-4" />
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-accentInk">
            <Scale className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <h1 className="text-xl font-semibold text-ink">Create your account</h1>
          <p className="text-sm text-subtle">Get started with LegalEase</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink">
              Name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-ink placeholder:text-subtle focus:border-accent focus:outline-none"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-ink placeholder:text-subtle focus:border-accent focus:outline-none"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-canvas px-3 py-2 text-sm text-ink placeholder:text-subtle focus:border-accent focus:outline-none"
              placeholder="At least 8 characters"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Creating account…" : "Sign up"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-subtle">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-ink hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
