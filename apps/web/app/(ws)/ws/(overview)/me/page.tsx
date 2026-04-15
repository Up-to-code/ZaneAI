import { getWorkspaceLocaleContext } from "../../_lib/workspaceLocale";
import { demoProfile, demoWorkspaceBehavior } from "../../_lib/demoData";
import ProfileWorkspace from "./_components/ProfileWorkspace";

/**
 * WHY:   The account screen should stay useful in demo mode even after removing live profile services.
 * WHAT:  Renders the existing profile workspace with deterministic fixture data.
 * HOW:   Supplies a local save handler that returns demo feedback only and never persists changes.
 */
export default async function WorkspaceMePage() {
  const { dictionary } = await getWorkspaceLocaleContext();

  async function saveProfileDemoAction() {
    "use server";
    return { ok: true as const, message: "تم حفظ التعديل داخل نسخة العرض فقط." };
  }

  return (
    <div className="mx-auto min-h-max w-full max-w-4xl space-y-5 p-6 pb-20 lg:min-h-full lg:p-8 lg:pb-24">
      <header className="space-y-1 px-1">
        <div className="text-[11px] font-semibold text-[var(--workspace-muted)]">{dictionary.settings.workspaceLabel}</div>
        <h1 className="text-[28px] font-bold tracking-tight text-foreground">{dictionary.settings.accountSettingsTitle}</h1>
        <p className="max-w-2xl text-sm font-medium leading-7 text-muted-foreground">{dictionary.settings.accountSettingsDescription}</p>
      </header>

      <ProfileWorkspace
        initialProfile={demoProfile}
        fallbackName={demoWorkspaceBehavior.user.name || "مستخدم Zane-ai"}
        fallbackEmail={demoWorkspaceBehavior.user.email || ""}
        onSave={saveProfileDemoAction}
      />
    </div>
  );
}
