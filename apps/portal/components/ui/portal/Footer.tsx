import { cn } from "@anan/ag-ui/anan";
import { getWebDictionary } from "@anan/ag-ui/anan";
import type { AppLocale } from "@anan/ag-ui/anan";

export default function Footer({ locale = "ar" }: { locale?: AppLocale }) {
    const dictionary = getWebDictionary(locale);

    return (
        <footer className={cn(
            "border-t border-border bg-white dark:bg-black py-12 px-6"
        )}>
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="space-y-2">
                        <div className="font-bold text-foreground">Zane Platform</div>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                           © 2026 Zane-AI Intelligence Node
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-8 text-[11px] font-bold">
                        <a href="/legal/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms</a>
                        <a href="/legal/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
                        <a href="/brand" className="text-muted-foreground hover:text-foreground transition-colors">Resources</a>
                        <a href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Support</a>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border/50 text-[9px] font-mono text-muted-foreground uppercase tracking-widest text-center md:text-left">
                    Infrastructure Status: Online / Latency: 24ms / Cluster: EU-WEST-1
                </div>
            </div>
        </footer>
    );
}
