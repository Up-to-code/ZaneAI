import { Footer, Navbar } from "@/app/(public)/public";
import { cookies } from "next/headers";
import { isRtlLocale, resolveLocale, WEB_LOCALE_COOKIE } from "@/lib/locale";
import PublicConvexProvider from "./PublicConvexProvider";

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const locale = resolveLocale(cookieStore.get(WEB_LOCALE_COOKIE)?.value);
    return (
        <div
            className="min-h-screen bg-background text-foreground selection:bg-[var(--zane-ai-accent)] selection:text-white transition-colors"
            dir={isRtlLocale(locale) ? "rtl" : "ltr"}
        >
            <Navbar locale={locale} />
            <PublicConvexProvider>
                {children}
            </PublicConvexProvider>
            <Footer locale={locale} />
        </div>
    );
}
