"use client";

import { useTransition } from "react";
import { Check, Globe } from "lucide-react";
import { Button } from "../button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import { getLocaleLabel, WEB_SUPPORTED_LOCALES } from "@anan/ag-ui/anan";
import { cn } from "@anan/ag-ui/anan";
import { useWebLocale } from "./WebLocaleProvider";

export default function WebLocaleSwitcher({
  className,
}: {
  className?: string;
}) {
  const { locale, dictionary } = useWebLocale();
  const [isPending, startTransition] = useTransition();

  function handleLocaleChange(nextLocale: (typeof WEB_SUPPORTED_LOCALES)[number]) {
    startTransition(async () => {
      const scope = window.location.pathname.startsWith("/ws") ? "workspace" : "web";
      const cookieName = scope === "workspace" ? "anan_workspace_locale" : "anan_web_locale";
      document.cookie = `${cookieName}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
      window.location.reload();
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={(
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={cn("h-10 w-10 rounded-[10px]", className)}
            aria-label={dictionary.nav.switchLanguage}
            title={dictionary.nav.switchLanguage}
            disabled={isPending}
          >
            <Globe className="h-4 w-4" />
          </Button>
        )}
      />
      <DropdownMenuContent align="end" className="min-w-44">
        {WEB_SUPPORTED_LOCALES.map((option) => (
          <DropdownMenuItem
            key={option}
            className="flex items-center justify-between gap-3"
            onClick={() => handleLocaleChange(option)}
          >
            <span>{getLocaleLabel(option)}</span>
            {locale === option ? <Check className="h-4 w-4" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
