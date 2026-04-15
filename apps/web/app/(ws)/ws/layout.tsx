import WorkspaceRootClient from "./_components/WorkspaceRootClient";

export default function WorkspaceRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-slot="workspace-root-layout"
      className="workspace-root-chrome flex h-full min-h-0 min-w-0 w-full flex-1 basis-0 flex-col"
    >
      <WorkspaceRootClient>{children}</WorkspaceRootClient>
    </div>
  );
}
