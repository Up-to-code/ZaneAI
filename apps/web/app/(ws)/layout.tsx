import { WebLocaleProvider } from "../_components/WebLocaleProvider";
import { getWebDictionary } from "@/lib/i18n";
import { getWorkspaceLocale } from "./ws/_lib/workspaceLocale";
import WorkspaceHeader from "../../components/WorkspaceHeader";
import ThemeToggle from "../_components/ThemeToggle";
import Link from "next/link";

export const dynamic = "force-dynamic";

/**
 * WHY:   Demo workspace routes still need shared locale context even after removing live auth/data providers.
 * WHAT:  Anchors the locale provider at the stable `(ws)` route-group boundary for all `/ws/*` screens.
 * HOW:   Leaves the route group presentation-only so every workspace page can render without Clerk or Convex.
 */
export default async function WorkspaceGroupLayout({ children }: { children: React.ReactNode }) {
  const locale = await getWorkspaceLocale();
  const dictionary = getWebDictionary(locale);

  return (
    <WebLocaleProvider locale={locale} dictionary={dictionary}>
      <div
        data-slot="workspace-group-layout"
        className="flex h-full min-h-screen min-h-dvh min-w-0 w-full flex-1 basis-0 flex-col"
      >
        <WorkspaceHeader />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </WebLocaleProvider>
  );
}
