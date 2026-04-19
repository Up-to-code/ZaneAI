import WorkspaceRootClient from "./_components/WorkspaceRootClient";

export default function WorkspaceRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-slot="workspace-root-layout"
      className="workspace-root-chrome flex h-dvh max-h-dvh min-h-0 min-w-0 w-full flex-col overflow-hidden"
    >
      <WorkspaceRootClient>{children}</WorkspaceRootClient>
    </div>
  );
}
