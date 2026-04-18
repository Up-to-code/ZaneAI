import type { Metadata } from "next";
import { Suspense } from "react";
import { cookies } from "next/headers";
import "./globals.css";
import { RootFontFaces, rootFontClassName } from "@/lib/rootFonts";
import { getWebDictionary, isRtlLocale, resolveLocale, WEB_LOCALE_COOKIE } from "@/lib/i18n";
import { WebLocaleProvider } from "@/components/ui/portal";
import WebAuthProvider from "./_components/WebAuthProvider";
import ThemeProvider from "./theme-provider";
import PortalNavbar from "../components/PortalNavbar";
import PortalFooter from "../components/PortalFooter";

export const metadata: Metadata = {
  title: "Zane-ai | Real Estate Intelligence",
  description: "The main portal for Zane-ai - Advanced Institutional Real Estate Intelligence",
  icons: {
    icon: "/brand-logo.svg",
  },
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
            <WebAuthProvider>
              <Suspense fallback={null}>
                <WebLocaleProvider locale={locale} dictionary={dictionary}>
                  <PortalNavbar />
                  <RootFontFaces />
                  {children}
                  <PortalFooter />
                </WebLocaleProvider>
              </Suspense>
            </WebAuthProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
