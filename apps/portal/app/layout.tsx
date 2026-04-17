import type { Metadata } from "next";
import { Suspense } from "react";
import { cookies } from "next/headers";
import "./globals.css";
import { RootFontFaces, rootFontClassName } from "@/lib/rootFonts";
import { getWebDictionary, isRtlLocale, resolveLocale, WEB_LOCALE_COOKIE } from "@zaneai/ag-ui/zaneai";
import { WebLocaleProvider, Navbar, Footer } from "@/components/ui/portal";
import ThemeProvider from "./theme-provider";

export const metadata: Metadata = {
  title: "Zane-ai | Real Estate Intelligence",
  description: "The main portal for Zane-ai - Advanced Institutional Real Estate Intelligence",
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
          <div className="min-h-screen bg-background text-foreground selection:bg-[var(--zane-ai-accent)] selection:text-white transition-colors">
            <Suspense fallback={null}>
              <WebLocaleProvider locale={locale} dictionary={dictionary}>
                <Navbar locale={locale} />
                <RootFontFaces />
                {children}
                <Footer locale={locale} />
              </WebLocaleProvider>
            </Suspense>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
