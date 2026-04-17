import type { Metadata } from "next";
import { Suspense } from "react";
import { cookies } from "next/headers";
import "./globals.css";
import { RootFontFaces, rootFontClassName } from "@/lib/rootFonts";
import { getWebDictionary, isRtlLocale, resolveLocale, WEB_LOCALE_COOKIE } from "@anan/ag-ui/anan";
import { WebLocaleProvider } from "@/components/ui/portal";
import WebAuthProvider from "./_components/WebAuthProvider";
import ThemeProvider from "./theme-provider";

export const metadata: Metadata = {
  title: "Zane-AI - Coming Soon",
  description: "Advanced Institutional Real Estate Intelligence",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(WEB_LOCALE_COOKIE)?.value);
  const dictionary = getWebDictionary(locale);
  return (
    <html lang={locale} dir={isRtlLocale(locale) ? "rtl" : "ltr"} suppressHydrationWarning>
      <body className={`${rootFontClassName} bg-background text-foreground antialiased`}>
        <ThemeProvider>
          <WebAuthProvider>
            <Suspense fallback={null}>
              <WebLocaleProvider locale={locale} dictionary={dictionary}>
                <RootFontFaces />
                {children}
              </WebLocaleProvider>
            </Suspense>
          </WebAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
