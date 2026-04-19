import { WebLocaleProvider } from "../_components/WebLocaleProvider";
import { getWebDictionary } from "@/lib/i18n";
import { getWorkspaceLocale } from "./ws/_lib/workspaceLocale";

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
        className="flex h-dvh max-h-dvh min-h-dvh w-full flex-col overflow-hidden"
      >
        <main className="min-h-0 flex-1 w-full overflow-hidden">
          {children}
        </main>
      </div>
    </WebLocaleProvider>
  );
}
