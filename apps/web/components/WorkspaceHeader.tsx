"use client";

import Link from "next/link";
import ThemeToggle from "../app/_components/ThemeToggle";
import WebLocaleSwitcher from "../app/_components/WebLocaleSwitcher";

/**
 * WHY:   Authenticated workspaces need a high-precision, distraction-free environment.
 * WHAT:  Renders a minimal header with the brand logo and core system toggles.
 * HOW:   Uses a fixed, thin header with subtle borders to anchor the workspace UI.
 */
export default function WorkspaceHeader() {
  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-border/10 bg-background/50 px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <Link href="/ws" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <img src="/brand-logo.svg" alt="Zane AI" className="h-6 w-auto" />
          <span className="text-sm font-black uppercase tracking-[0.2em]">Zane-AI</span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <WebLocaleSwitcher />
        <ThemeToggle />
      </div>
    </header>
  );
}
