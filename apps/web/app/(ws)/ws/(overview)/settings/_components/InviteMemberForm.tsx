"use client";

import { useMemo, useState, useTransition } from "react";
import { Search, UserPlus } from "lucide-react";
import { useWebLocale } from "@/app/_components/WebLocaleProvider";
import { cn } from "@/lib/i18n";
import type { DirectorySearchResult } from "@/server/contracts/organizations";

type InviteMemberFormProps = {
  canManage: boolean;
  hasOrganization: boolean;
  showHeader?: boolean;
  onCreateInvite: (input: {
    email: string;
    role: "manager" | "member" | "viewer";
  }) => Promise<{ ok: true; message: string; inviteId?: string } | { ok: false; message: string }>;
  onSearchDirectory: (query: string) => Promise<{ ok: true; results: DirectorySearchResult[] } | { ok: false; message: string }>;
};

const roles = ["manager", "member", "viewer"] as const;

export default function InviteMemberForm({
  canManage,
  hasOrganization,
  showHeader = true,
  onCreateInvite,
  onSearchDirectory,
}: InviteMemberFormProps) {
  const { dictionary, direction } = useWebLocale();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<(typeof roles)[number]>("member");
  const [status, setStatus] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [searchResults, setSearchResults] = useState<DirectorySearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const getRoleLabel = (r: (typeof roles)[number]) => {
    if (r === "manager") return dictionary.settings.manager;
    if (r === "member") return dictionary.settings.member;
    return dictionary.settings.viewer;
  };

  const handleSearch = useMemo(() => {
    let timer: NodeJS.Timeout;
    return (query: string) => {
      setEmail(query);
      if (query.length < 2) {
        setSearchResults([]);
        return;
      }
      clearTimeout(timer);
      timer = setTimeout(async () => {
        setIsSearching(true);
        const result = await onSearchDirectory(query);
        setIsSearching(false);
        if (result.ok) {
          setSearchResults(result.results);
        }
      }, 300);
    };
  }, [onSearchDirectory]);

  if (!hasOrganization) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      setStatus(dictionary.settings.inviteFailed);
      return;
    }
    setStatus(dictionary.settings.inviteSending);
    startTransition(async () => {
      const result = await onCreateInvite({ email, role });
      setStatus(result.message);
      if (result.ok) {
        setEmail("");
        setSearchResults([]);
      }
    });
  }

  return (
    <div className="space-y-10" dir={direction}>
      {showHeader && (
        <div className="space-y-3 px-1">
          <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--zane-ai-deep)] dark:text-white lg:text-3xl">
            {dictionary.settings.inviteMemberTitle}
          </h2>
          <p className="max-w-2xl text-[13px] font-medium leading-relaxed text-[var(--zane-ai-text-muted)] dark:text-white/40">
            {dictionary.settings.inviteMemberDescription}
          </p>
        </div>
      )}

      {status ? (
        <div className="px-1 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--zane-ai-accent)]">
          {status}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-10 px-1">
        <div className="space-y-8">
          <div className="relative space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--zane-ai-text-muted)] opacity-70">
              {dictionary.settings.inviteSearchLabel}
            </label>
            <div className="relative">
              <input
                type="email"
                autoComplete="off"
                value={email}
                onChange={(e) => handleSearch(e.target.value)}
                disabled={isPending || !canManage}
                placeholder="identity@institutional.id"
                dir="ltr"
                className="w-full border-b border-[color:var(--workspace-border)] bg-transparent py-3 pr-10 text-lg font-black uppercase tracking-tight text-[var(--zane-ai-deep)] transition-all placeholder:opacity-40 focus-visible:border-[var(--zane-ai-accent)] focus-visible:outline-none dark:text-white disabled:opacity-40"
              />
              <Search className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--zane-ai-text-muted)] opacity-40" />
            </div>

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-10 mt-4 overflow-hidden rounded-3xl border border-[color:var(--workspace-border)] bg-[var(--workspace-panel)] shadow-2xl shadow-black/40 ring-1 ring-black/5 dark:ring-white/10">
                <div className="divide-y divide-[color:var(--workspace-border)]">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      type="button"
                      onClick={() => {
                        setEmail(result.email);
                        setSearchResults([]);
                      }}
                      className="flex w-full items-center gap-6 p-6 transition-all hover:bg-[var(--zane-ai-accent)] hover:text-white group"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--workspace-shell)]/50 text-lg font-black uppercase text-[var(--zane-ai-deep)] dark:text-white group-hover:bg-white group-hover:text-[var(--zane-ai-accent)]">
                        {result.name[0]}
                      </div>
                      <div className="flex flex-col items-start min-w-0">
                        <div className="truncate text-[15px] font-black uppercase tracking-tight">{result.name}</div>
                        <div className="truncate text-[11px] font-medium opacity-50 transition-opacity group-hover:opacity-100">{result.email}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-5">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--zane-ai-text-muted)] opacity-70">
              {dictionary.settings.roleLabel}
            </label>
            <div className="flex flex-wrap gap-2.5">
              {roles.map((r) => (
                <button
                  key={r}
                  type="button"
                  disabled={isPending || !canManage}
                  onClick={() => setRole(r)}
                  className={cn(
                    "h-10 rounded-full px-8 text-[11px] font-black uppercase tracking-[0.15em] transition-all",
                    role === r
                      ? "bg-[var(--zane-ai-deep)] text-white dark:bg-white dark:text-black shadow-lg shadow-black/10"
                      : "bg-transparent border border-[color:var(--workspace-border)] text-[var(--zane-ai-deep)] dark:text-white/60 hover:bg-[var(--workspace-shell)]/50 hover:text-[var(--zane-ai-deep)] dark:hover:text-white disabled:opacity-40",
                  )}
                >
                  {getRoleLabel(r)}
                </button>
              ))}
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--zane-ai-text-muted)] opacity-60">
              {dictionary.settings.managerGuardrail}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-10 pt-10 border-t border-[color:var(--workspace-border)]">
          <p className="max-w-md text-[10px] font-black uppercase tracking-[0.2em] text-[var(--zane-ai-text-muted)] opacity-60">
            {canManage
              ? dictionary.settings.managerOnlySubmissionHint
              : dictionary.settings.viewerSubmissionHint}
          </p>
          <button
            type="submit"
            disabled={isPending || !canManage || !email.includes("@")}
            className="group relative inline-flex h-13 items-center gap-4 overflow-hidden rounded-full bg-[var(--zane-ai-accent)] px-10 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-[var(--zane-ai-accent)]/20 transition-all hover:bg-[var(--zane-ai-accent)]/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <UserPlus className="relative z-10 h-5 w-5" strokeWidth={3} />
            <span className="relative z-10">
              {isPending ? dictionary.settings.inviteSending : dictionary.settings.inviteMember}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
