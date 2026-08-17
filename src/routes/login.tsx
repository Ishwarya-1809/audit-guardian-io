import { FormEvent, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Privexa — Sign In" },
      {
        name: "description",
        content:
          "Sign in to your Privexa DPDP privacy audit workspace.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    // ---------------------------------------------------------------
    // Demo authentication
    // ---------------------------------------------------------------
    //
    // These credentials are for the current demo version only.
    // We can replace this with your FastAPI authentication later.
    //
    const DEMO_EMAIL = "admin@privexa.com";
    const DEMO_PASSWORD = "Admin@123";

    if (
      trimmedEmail === DEMO_EMAIL &&
      password === DEMO_PASSWORD
    ) {
      localStorage.setItem(
        "privexa_authenticated",
        "true",
      );

      localStorage.setItem(
        "privexa_user",
        JSON.stringify({
          name: "Admin User",
          email: DEMO_EMAIL,
          initials: "AR",
        }),
      );

      navigate({
        to: "/",
      });

      return;
    }

    setLoading(false);
    setError("Invalid email or password.");
  };

  return (
    <div className="flex min-h-screen bg-background">

      {/* ============================================================
          Left branding panel
      ============================================================ */}
      <div className="hidden flex-1 items-center justify-center bg-secondary/40 p-10 lg:flex">
        <div className="max-w-md">

          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <ShieldCheck className="h-6 w-6" />
            </span>

            <span className="text-xl font-semibold tracking-tight">
              Privexa
            </span>
          </div>

          <h1 className="mt-10 text-4xl font-semibold leading-tight tracking-tight">
            Privacy compliance,
            <br />
            made audit-ready.
          </h1>

          <p className="mt-5 text-sm leading-7 text-muted-foreground">
            Monitor DPDP compliance, identify high-risk
            processing activities, track findings, and manage
            remediation from one privacy audit workspace.
          </p>

          <div className="mt-8 space-y-3">
            <Feature text="DPDP compliance monitoring" />
            <Feature text="AI-powered privacy findings" />
            <Feature text="Risk and remediation tracking" />
          </div>
        </div>
      </div>

      {/* ============================================================
          Login panel
      ============================================================ */}
      <div className="flex w-full items-center justify-center px-5 py-10 lg:w-[520px] lg:px-12">

        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
              <ShieldCheck className="h-5 w-5" />
            </span>

            <span className="text-lg font-semibold">
              Privexa
            </span>
          </div>

          <div>
            <h2 className="text-3xl font-semibold tracking-tight">
              Welcome back
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to your privacy audit workspace.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium"
              >
                Email
              </label>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="admin@privexa.com"
                  autoComplete="email"
                  className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium"
                >
                  Password
                </label>
              </div>

              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-11 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-risk-high/20 bg-risk-high-soft px-3.5 py-3 text-sm text-risk-high">
                {error}
              </div>
            )}

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Signing in..."
                : "Sign In"}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 rounded-xl border border-border/70 bg-secondary/50 p-4">
            <p className="text-xs font-semibold text-foreground">
              Demo credentials
            </p>

            <p className="mt-2 text-xs text-muted-foreground">
              Email:{" "}
              <span className="font-medium text-foreground">
                admin@privexa.com
              </span>
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Password:{" "}
              <span className="font-medium text-foreground">
                Admin@123
              </span>
            </p>
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            PrivacyAudit AI · DPDP Compliance Workspace
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Login page feature item
// ---------------------------------------------------------------------------

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-6 w-6 place-items-center rounded-full bg-primary/10">
        <ShieldCheck className="h-3.5 w-3.5 text-primary" />
      </span>

      <span className="text-sm text-muted-foreground">
        {text}
      </span>
    </div>
  );
}