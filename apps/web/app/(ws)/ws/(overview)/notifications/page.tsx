import { cn } from "@/lib/i18n";
import Link from "next/link";
import ZonePageIntro from "../../_components/ZoneShell/ZonePageIntro";
import { getWorkspaceLocaleContext } from "../../_lib/workspaceLocale";

type WorkspaceNotificationsPageProps = {
  searchParams: Promise<{
    filter?: string;
  }>;
};

/**
 * WHY:   The notifications center should display real notification data from the backend.
 * WHAT:  Currently shows an empty notifications state until a real notifications query is built.
 * HOW:   Renders the page with an empty notification list and filter controls.
 */
export default async function WorkspaceNotificationsPage({ searchParams }: WorkspaceNotificationsPageProps) {
  const { dictionary } = await getWorkspaceLocaleContext();
  const { filter } = await searchParams;
  const notifications: never[] = [];
  const summary = { unreadCount: 0 };
  const activeFilter = filter === "unread" ? "unread" : "all";

  return (
    <div className="flex min-h-full flex-col">
      <ZonePageIntro
        eyebrow={dictionary.notifications.eyebrow}
        title={dictionary.notifications.title}
        description={dictionary.notifications.description}
      />

      <div className="space-y-6 px-6 py-8 lg:px-10 lg:py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex gap-1 rounded-2xl bg-muted/20 p-1.5 border border-border/40">
            <Link
              href="/ws/notifications"
              className={cn(
                "rounded-xl px-5 py-2 text-[11px] font-black uppercase tracking-widest transition-all",
                activeFilter === "all"
                  ? "bg-foreground text-background shadow-md"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground active:scale-95"
              )}
            >
              {dictionary.notifications.all} ({notifications.length})
            </Link>
            <Link
              href="/ws/notifications?filter=unread"
              className={cn(
                "rounded-xl px-5 py-2 text-[11px] font-black uppercase tracking-widest transition-all",
                activeFilter === "unread"
                  ? "bg-foreground text-background shadow-md"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground active:scale-95"
              )}
            >
              {dictionary.notifications.unread} ({summary.unreadCount})
            </Link>
          </div>

          <div className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/50">
            {dictionary.notifications.noPending}
          </div>
        </div>

        <div className="grid gap-2 text-right">
          <div className="rounded-3xl border border-dashed border-border bg-muted/10 p-12 text-center text-[13px] font-bold text-muted-foreground/60 shadow-sm transition-all hover:bg-muted/15">
            {dictionary.notifications.empty}
          </div>
        </div>
      </div>
    </div>
  );
}
