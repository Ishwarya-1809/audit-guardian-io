import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  AlertTriangle,
  Bell,
  Loader2,
  RefreshCw,
  Search,
  ShieldCheck,
  X,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

import {
  fetchFindings,
  fetchProcesses,
  type Finding,
  type ProcessActivity,
} from "@/lib/privacy-data";

const navItems = [
  { label: "Dashboard", to: "/" },
  { label: "Data Flows", to: "/data-flows" },
  { label: "Reports", to: "/reports" },
  { label: "Remediation", to: "/remediation" },
];

export function TopNav({
  scanning,
  onRescan,
}: {
  scanning: boolean;
  onRescan: () => void;
}) {
  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------

  const [query, setQuery] = useState("");

  const [processes, setProcesses] = useState<ProcessActivity[]>(
    [],
  );

  const [findings, setFindings] = useState<Finding[]>(
    [],
  );

  const [searchOpen, setSearchOpen] = useState(false);

  const [searchLoading, setSearchLoading] =
    useState(false);

  const [notificationsOpen, setNotificationsOpen] =
    useState(false);

  const [userMenuOpen, setUserMenuOpen] =
    useState(false);

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [settingsOpen, setSettingsOpen] =
    useState(false);

  // Settings

  const [notificationsEnabled, setNotificationsEnabled] =
    useState(true);

  const [autoRefresh, setAutoRefresh] =
    useState(true);

  const [darkMode, setDarkMode] =
    useState(false);

  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });

  // ---------------------------------------------------------------------------
  // LOAD BACKEND DATA
  // ---------------------------------------------------------------------------

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setSearchLoading(true);

      try {
        const [processData, findingData] =
          await Promise.all([
            fetchProcesses(),
            fetchFindings(),
          ]);

        if (!cancelled) {
          setProcesses(processData);
          setFindings(findingData);
        }
      } catch (error) {
        console.error(
          "Failed to load header data:",
          error,
        );

        if (!cancelled) {
          setProcesses([]);
          setFindings([]);
        }
      } finally {
        if (!cancelled) {
          setSearchLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  // ---------------------------------------------------------------------------
  // NOTIFICATIONS
  // ---------------------------------------------------------------------------

  const notifications = findings.filter(
    (finding) =>
      finding.status === "open" &&
      finding.severity === "high",
  );

  const notificationCount =
    notificationsEnabled
      ? notifications.length
      : 0;

  // ---------------------------------------------------------------------------
  // SEARCH
  // ---------------------------------------------------------------------------

  const searchTerm =
    query.trim().toLowerCase();

  const matchingProcesses = searchTerm
    ? processes
        .filter((process) => {
          const text = [
            process.name,
            process.category,
            process.purpose,
            ...process.dataTypes,
          ]
            .join(" ")
            .toLowerCase();

          return text.includes(searchTerm);
        })
        .slice(0, 5)
    : [];

  const matchingFindings = searchTerm
    ? findings
        .filter((finding) => {
          const text = [
            finding.title,
            finding.section,
            finding.process,
            finding.explanation,
            finding.suggestedFix,
          ]
            .join(" ")
            .toLowerCase();

          return text.includes(searchTerm);
        })
        .slice(0, 5)
    : [];

  const totalResults =
    matchingProcesses.length +
    matchingFindings.length;

  const handleSearchChange = (
    value: string,
  ) => {
    setQuery(value);

    setSearchOpen(
      value.trim().length > 0,
    );

    setNotificationsOpen(false);
    setUserMenuOpen(false);
  };

  const clearSearch = () => {
    setQuery("");
    setSearchOpen(false);
  };

  // ---------------------------------------------------------------------------
  // NOTIFICATION MENU
  // ---------------------------------------------------------------------------

  const handleNotificationClick = () => {
    setNotificationsOpen(
      (value) => !value,
    );

    setSearchOpen(false);
    setUserMenuOpen(false);
  };

  // ---------------------------------------------------------------------------
  // USER MENU
  // ---------------------------------------------------------------------------

  const handleUserMenuClick = () => {
    setUserMenuOpen(
      (value) => !value,
    );

    setNotificationsOpen(false);
    setSearchOpen(false);
  };

  // ---------------------------------------------------------------------------
  // LOGOUT
  // ---------------------------------------------------------------------------

  const handleLogout = () => {
    localStorage.removeItem(
      "privexa_authenticated",
    );

    localStorage.removeItem(
      "privexa_user",
    );

    sessionStorage.removeItem(
      "privexa_authenticated",
    );

    sessionStorage.removeItem(
      "privexa_user",
    );

    window.location.href = "/login";
  };

  // ---------------------------------------------------------------------------
  // DARK MODE
  // ---------------------------------------------------------------------------

  const handleDarkMode = () => {
    setDarkMode((value) => {
      const nextValue = !value;

      document.documentElement.classList.toggle(
        "dark",
        nextValue,
      );

      return nextValue;
    });
  };

  // ---------------------------------------------------------------------------
  // UI
  // ---------------------------------------------------------------------------

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto grid max-w-[1440px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3.5 lg:flex lg:justify-between lg:px-8">

          {/* ===============================================================
              LOGO
          ================================================================ */}

          <Link
            to="/"
            className="flex min-w-0 items-center gap-2.5"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
              <ShieldCheck className="h-[18px] w-[18px]" />
            </span>

            <span className="truncate text-[15px] font-semibold tracking-tight">
              Privexa
            </span>
          </Link>

          {/* ===============================================================
              NAVIGATION
          ================================================================ */}

          <nav className="order-3 col-span-2 -mx-1 flex items-center gap-1 overflow-x-auto lg:order-none lg:mx-0 lg:col-auto">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "shrink-0 rounded-full px-3.5 py-1.5 text-sm transition-colors",

                  pathname === item.to
                    ? "bg-secondary font-semibold text-foreground"
                    : "font-medium text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* ===============================================================
              RIGHT SIDE ACTIONS
          ================================================================ */}

          <div className="flex shrink-0 items-center gap-2.5">

            {/* =============================================================
                SEARCH
            ============================================================= */}

            <div className="relative hidden xl:block">

              <label className="relative block">

                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  value={query}
                  onChange={(e) =>
                    handleSearchChange(
                      e.target.value,
                    )
                  }
                  onFocus={() => {
                    if (query.trim()) {
                      setSearchOpen(true);
                    }
                  }}
                  placeholder="Search processes or findings..."
                  aria-label="Search processes or findings"
                  className="h-10 w-72 rounded-full bg-secondary pl-9 pr-10 text-sm outline-none ring-primary/40 placeholder:text-muted-foreground focus:ring-2"
                />

                {query && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-muted-foreground hover:bg-background hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}

              </label>

              {/* SEARCH DROPDOWN */}

              {searchOpen && (
                <div className="absolute right-0 top-12 z-50 w-[380px] overflow-hidden rounded-2xl border border-border bg-background shadow-xl">

                  <div className="border-b border-border/70 px-4 py-3">

                    <p className="text-sm font-semibold">
                      Search results
                    </p>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {searchLoading
                        ? "Searching..."
                        : `${totalResults} result${
                            totalResults ===
                            1
                              ? ""
                              : "s"
                          } found`}
                    </p>

                  </div>

                  {searchLoading && (
                    <div className="flex items-center justify-center gap-2 px-4 py-8 text-sm text-muted-foreground">

                      <Loader2 className="h-4 w-4 animate-spin" />

                      Loading data...

                    </div>
                  )}

                  {!searchLoading &&
                    totalResults === 0 &&
                    searchTerm && (
                      <div className="px-5 py-8 text-center">

                        <Search className="mx-auto mb-3 h-6 w-6 text-muted-foreground" />

                        <p className="text-sm font-medium">
                          No results found
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          No processes or findings
                          match "{query.trim()}".
                        </p>

                      </div>
                    )}

                  {!searchLoading &&
                    totalResults > 0 && (
                      <div className="max-h-[420px] overflow-y-auto">

                        {/* PROCESSES */}

                        {matchingProcesses.length >
                          0 && (
                          <div className="px-2 pb-2 pt-3">

                            <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                              Processes
                            </p>

                            {matchingProcesses.map(
                              (process) => (
                                <button
                                  key={process.id}
                                  type="button"
                                  onClick={() => {
                                    setQuery(
                                      process.name,
                                    );

                                    setSearchOpen(
                                      false,
                                    );
                                  }}
                                  className="flex w-full items-start gap-3 rounded-xl px-2.5 py-2.5 text-left hover:bg-secondary"
                                >

                                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                                    <ShieldCheck className="h-4 w-4" />
                                  </span>

                                  <span className="min-w-0 flex-1">

                                    <span className="block truncate text-sm font-medium">
                                      {process.name}
                                    </span>

                                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                                      {process.category}
                                    </span>

                                  </span>

                                </button>
                              ),
                            )}

                          </div>
                        )}

                        {/* FINDINGS */}

                        {matchingFindings.length >
                          0 && (
                          <div className="border-t border-border/60 px-2 pb-2 pt-3">

                            <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                              Findings
                            </p>

                            {matchingFindings.map(
                              (finding) => (
                                <button
                                  key={finding.id}
                                  type="button"
                                  onClick={() => {
                                    setQuery(
                                      finding.title,
                                    );

                                    setSearchOpen(
                                      false,
                                    );
                                  }}
                                  className="flex w-full items-start gap-3 rounded-xl px-2.5 py-2.5 text-left hover:bg-secondary"
                                >

                                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-risk-high/10">
                                    <AlertTriangle className="h-4 w-4 text-risk-high" />
                                  </span>

                                  <span className="min-w-0 flex-1">

                                    <span className="block line-clamp-2 text-sm font-medium">
                                      {finding.title}
                                    </span>

                                    <span className="mt-1 block truncate text-xs text-muted-foreground">
                                      {finding.section} •{" "}
                                      {finding.process}
                                    </span>

                                  </span>

                                </button>
                              ),
                            )}

                          </div>
                        )}

                      </div>
                    )}

                </div>
              )}

            </div>

            {/* MOBILE SEARCH */}

            <button
              type="button"
              onClick={() => {
                setSearchOpen(
                  (value) => !value,
                );

                setNotificationsOpen(false);
                setUserMenuOpen(false);
              }}
              className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-muted-foreground xl:hidden"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* =============================================================
                RE-SCAN
            ============================================================= */}

            <button
              type="button"
              onClick={onRescan}
              disabled={scanning}
              className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-70"
            >

              {scanning ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}

              <span className="hidden sm:inline">
                {scanning
                  ? "Scanning..."
                  : "Re-scan"}
              </span>

            </button>

            {/* =============================================================
                NOTIFICATIONS
            ============================================================= */}

            <div className="relative">

              <button
                type="button"
                onClick={
                  handleNotificationClick
                }
                aria-label="Notifications"
                aria-expanded={
                  notificationsOpen
                }
                className="relative grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >

                <Bell className="h-[18px] w-[18px]" />

                {notificationCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 grid min-h-5 min-w-5 place-items-center rounded-full bg-risk-high px-1 text-[10px] font-bold leading-none text-white ring-2 ring-background">
                    {notificationCount >
                    99
                      ? "99+"
                      : notificationCount}
                  </span>
                )}

              </button>

              {notificationsOpen && (
                <div className="absolute right-0 top-12 z-50 w-[360px] overflow-hidden rounded-2xl border border-border bg-background shadow-xl">

                  <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">

                    <div>

                      <h3 className="text-sm font-semibold">
                        Notifications
                      </h3>

                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {notificationCount >
                        0
                          ? `${notificationCount} important finding${
                              notificationCount ===
                              1
                                ? ""
                                : "s"
                            }`
                          : "You're all caught up"}
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setNotificationsOpen(
                          false,
                        )
                      }
                      className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-secondary"
                    >
                      <X className="h-4 w-4" />
                    </button>

                  </div>

                  {notifications.length ===
                  0 ? (
                    <div className="px-6 py-10 text-center">

                      <Bell className="mx-auto mb-3 h-6 w-6 text-muted-foreground" />

                      <p className="text-sm font-medium">
                        No new notifications
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        There are currently no
                        open high-severity
                        findings requiring your
                        attention.
                      </p>

                    </div>
                  ) : (
                    <div className="max-h-[360px] overflow-y-auto divide-y divide-border/60">

                      {notifications.map(
                        (finding) => (
                          <div
                            key={finding.id}
                            className="flex gap-3 px-4 py-3.5 hover:bg-secondary/50"
                          >

                            <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-risk-high/10">
                              <AlertTriangle className="h-4 w-4 text-risk-high" />
                            </span>

                            <div className="min-w-0 flex-1">

                              <p className="text-sm font-medium">
                                High-risk finding
                                detected
                              </p>

                              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                {finding.title}
                              </p>

                              <p className="mt-2 text-[11px] text-muted-foreground">
                                {finding.section} •{" "}
                                {finding.process}
                              </p>

                            </div>

                          </div>
                        ),
                      )}

                    </div>
                  )}

                </div>
              )}

            </div>

            {/* =============================================================
                AR USER MENU
            ============================================================= */}

            <div className="relative">

              <button
                type="button"
                onClick={handleUserMenuClick}
                aria-label="Open user menu"
                aria-expanded={
                  userMenuOpen
                }
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-xs font-semibold text-accent-foreground transition-all hover:ring-2 hover:ring-primary/30"
              >
                AR
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-12 z-50 w-[280px] overflow-hidden rounded-2xl border border-border bg-background shadow-xl">

                  {/* USER */}

                  <div className="border-b border-border/70 px-4 py-4">

                    <div className="flex items-center gap-3">

                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                        AR
                      </span>

                      <div className="min-w-0">

                        <p className="truncate text-sm font-semibold">
                          Admin User
                        </p>

                        <p className="truncate text-xs text-muted-foreground">
                          admin@privexa.com
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* MENU */}

                  <div className="p-2">

                    {/* PROFILE */}

                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(
                          false,
                        );

                        setProfileOpen(true);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm hover:bg-secondary"
                    >

                      <User className="h-4 w-4 text-muted-foreground" />

                      <span>
                        Profile
                      </span>

                    </button>

                    {/* SETTINGS */}

                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(
                          false,
                        );

                        setSettingsOpen(
                          true,
                        );
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm hover:bg-secondary"
                    >

                      <Settings className="h-4 w-4 text-muted-foreground" />

                      <span>
                        Settings
                      </span>

                    </button>

                  </div>

                  {/* LOGOUT */}

                  <div className="border-t border-border/70 p-2">

                    <button
                      type="button"
                      onClick={
                        handleLogout
                      }
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-risk-high hover:bg-risk-high/10"
                    >

                      <LogOut className="h-4 w-4" />

                      <span>
                        Logout
                      </span>

                    </button>

                  </div>

                </div>
              )}

            </div>

          </div>

        </div>
      </header>

      {/* =====================================================================
          PROFILE MODAL
      ====================================================================== */}

      {profileOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 px-4 backdrop-blur-sm"
          onClick={() =>
            setProfileOpen(false)
          }
        >

          <div
            className="w-full max-w-md overflow-hidden rounded-3xl bg-background shadow-2xl ring-1 ring-border"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* PROFILE HEADER */}

            <div className="flex items-center justify-between border-b border-border/70 px-6 py-5">

              <div>

                <h2 className="text-lg font-semibold tracking-tight">
                  Profile
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  Your Privexa account
                  information
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setProfileOpen(false)
                }
                aria-label="Close profile"
                className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>

            </div>

            {/* PROFILE CONTENT */}

            <div className="px-6 py-6">

              <div className="flex items-center gap-4">

                <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-accent text-lg font-semibold text-accent-foreground">
                  AR
                </span>

                <div className="min-w-0">

                  <h3 className="text-base font-semibold">
                    Admin User
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    admin@privexa.com
                  </p>

                  <span className="mt-2 inline-flex rounded-full bg-risk-low-soft px-2.5 py-1 text-[11px] font-semibold text-risk-low">
                    Active
                  </span>

                </div>

              </div>

              <div className="mt-6 space-y-3">

                <div className="rounded-2xl bg-secondary/60 px-4 py-3">

                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Role
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    Privacy Administrator
                  </p>

                </div>

                <div className="rounded-2xl bg-secondary/60 px-4 py-3">

                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Organization
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    Fintech App
                  </p>

                </div>

                <div className="rounded-2xl bg-secondary/60 px-4 py-3">

                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Workspace
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    DPDP Compliance
                    Workspace
                  </p>

                </div>

              </div>

            </div>

            {/* PROFILE FOOTER */}

            <div className="border-t border-border/70 bg-secondary/30 px-6 py-4">

              <button
                type="button"
                onClick={() =>
                  setProfileOpen(false)
                }
                className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Done
              </button>

            </div>

          </div>

        </div>
      )}

      {/* =====================================================================
          SETTINGS MODAL
      ====================================================================== */}

      {settingsOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 px-4 backdrop-blur-sm"
          onClick={() =>
            setSettingsOpen(false)
          }
        >

          <div
            className="w-full max-w-md overflow-hidden rounded-3xl bg-background shadow-2xl ring-1 ring-border"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* SETTINGS HEADER */}

            <div className="flex items-center justify-between border-b border-border/70 px-6 py-5">

              <div>

                <h2 className="text-lg font-semibold tracking-tight">
                  Settings
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  Manage your Privexa
                  workspace preferences
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSettingsOpen(false)
                }
                aria-label="Close settings"
                className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>

            </div>

            {/* SETTINGS */}

            <div className="space-y-3 px-6 py-6">

              {/* NOTIFICATIONS */}

              <div className="flex items-center justify-between rounded-2xl bg-secondary/60 px-4 py-4">

                <div className="pr-4">

                  <p className="text-sm font-semibold">
                    Notifications
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Show important privacy
                    alerts
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setNotificationsEnabled(
                      (value) => !value,
                    )
                  }
                  className={cn(
                    "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                    notificationsEnabled
                      ? "bg-primary"
                      : "bg-border",
                  )}
                  aria-label="Toggle notifications"
                >

                  <span
                    className={cn(
                      "absolute top-1 h-4 w-4 rounded-full bg-white transition-transform",
                      notificationsEnabled
                        ? "left-6"
                        : "left-1",
                    )}
                  />

                </button>

              </div>

              {/* AUTO REFRESH */}

              <div className="flex items-center justify-between rounded-2xl bg-secondary/60 px-4 py-4">

                <div className="pr-4">

                  <p className="text-sm font-semibold">
                    Auto-refresh
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Refresh dashboard data
                    automatically
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setAutoRefresh(
                      (value) => !value,
                    )
                  }
                  className={cn(
                    "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                    autoRefresh
                      ? "bg-primary"
                      : "bg-border",
                  )}
                  aria-label="Toggle auto-refresh"
                >

                  <span
                    className={cn(
                      "absolute top-1 h-4 w-4 rounded-full bg-white transition-transform",
                      autoRefresh
                        ? "left-6"
                        : "left-1",
                    )}
                  />

                </button>

              </div>

              {/* DARK MODE */}

              <div className="flex items-center justify-between rounded-2xl bg-secondary/60 px-4 py-4">

                <div className="pr-4">

                  <p className="text-sm font-semibold">
                    Dark mode
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Use a darker interface
                    appearance
                  </p>

                </div>

                <button
                  type="button"
                  onClick={
                    handleDarkMode
                  }
                  className={cn(
                    "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                    darkMode
                      ? "bg-primary"
                      : "bg-border",
                  )}
                  aria-label="Toggle dark mode"
                >

                  <span
                    className={cn(
                      "absolute top-1 h-4 w-4 rounded-full bg-white transition-transform",
                      darkMode
                        ? "left-6"
                        : "left-1",
                    )}
                  />

                </button>

              </div>

            </div>

            {/* SETTINGS FOOTER */}

            <div className="border-t border-border/70 bg-secondary/30 px-6 py-4">

              <button
                type="button"
                onClick={() =>
                  setSettingsOpen(false)
                }
                className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Done
              </button>

            </div>

          </div>

        </div>
      )}
    </>
  );
}