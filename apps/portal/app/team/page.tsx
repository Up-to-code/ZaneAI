import { Section } from "@/components/ui/portal";
import { cookies } from "next/headers";
import { resolveLocale, WEB_LOCALE_COOKIE, getWebDictionary } from "@/lib/i18n";
import { Users, Linkedin, Mail, Twitter } from "lucide-react";

const TEAM_MEMBERS = [
  { name: "Ahmed Mansour", role: "CEO & Founder", bio: "Leading the architectural vision of Zane-ai and institutional real estate intelligence.", image: null },
  { name: "Sarah Chen", role: "Head of AI", bio: "Architecting the predictive models and intelligence layers powering the portal.", image: null },
  { name: "Marcus Stone", role: "Director of Operations", bio: "Ensuring seamless coordination between developers and brokers globally.", image: null },
  { name: "Elena Rossi", role: "Chief Design Officer", bio: "The visionary behind the Pure Canvas aesthetic and institutional UI.", image: null },
];

export default async function TeamPage() {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(WEB_LOCALE_COOKIE)?.value);
  const dictionary = getWebDictionary(locale);

  return (
    <main className="min-h-screen bg-white dark:bg-black pt-20 transition-all selection:bg-primary selection:text-white">
      <Section className="py-20 lg:py-28 border-b border-border/50">
        <div className="mx-auto max-w-4xl px-6 lg:px-10 text-center space-y-12">
            <div className="space-y-8 flex flex-col items-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-slate-50 dark:bg-zinc-900 px-4 py-1.5 text-xs font-bold text-foreground">
                    <span className="text-xl leading-none -mt-1">★</span>
                    Our Team
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-[5.5rem] font-bold tracking-tighter text-foreground leading-[1.05]" dir="auto">
                    Meet the <br/> Visionaries.
                </h1>
                <p className="text-lg md:text-xl font-medium leading-relaxed text-muted-foreground max-w-2xl mx-auto pt-2" dir="auto">
                    A collective of architects, engineers, and visionaries dedicated to building the unified operating system for real estate.
                </p>
            </div>
        </div>
      </Section>

      <Section className="py-16 md:py-24 bg-slate-50/50 dark:bg-zinc-950/20 relative overflow-hidden">
        <div className="absolute top-0 end-1/4 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 space-y-12 md:space-y-24">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {TEAM_MEMBERS.map((member, i) => (
              <div key={i} className="group relative rounded-3xl md:rounded-[2.5rem] border border-border bg-white dark:bg-black p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 md:space-y-8 shadow-sm transition-all hover:border-black/20 dark:hover:border-zinc-700 isolate [transform:translateZ(0)]">
                 <div className="aspect-square w-full rounded-2xl md:rounded-[1.5rem] bg-zinc-100 dark:bg-zinc-900 overflow-hidden flex items-center justify-center grayscale group-hover:grayscale-0 transition-all border border-black/5 dark:border-white/5">
                    <Users className="h-10 w-10 md:h-16 md:w-16 text-zinc-400 opacity-20" />
                 </div>
                 <div className="space-y-1 sm:space-y-2 text-start">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold tracking-tight" dir="auto">{member.name}</h3>
                    <p className="text-xs sm:text-sm font-bold text-primary" dir="auto">{member.role}</p>
                 </div>
                 <p className="text-xs sm:text-sm md:text-base font-medium text-muted-foreground leading-relaxed text-start hidden sm:block" dir="auto">
                    {member.bio}
                 </p>
                 <div className="flex items-center gap-4 pt-4 border-t border-border/50 justify-start">
                    <Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
                    <Twitter className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
                    <Mail className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
                 </div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl md:rounded-[3rem] bg-black dark:bg-zinc-950 p-8 sm:p-12 md:p-20 text-center text-white space-y-6 md:space-y-10 border border-white/10 isolate [transform:translateZ(0)] relative overflow-hidden">
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-primary/20 blur-[100px] md:blur-[150px] rounded-full" />
             </div>
             <div className="relative z-10 space-y-6 md:space-y-8 flex flex-col items-center">
                 <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter" dir="auto">Careers at Zane-ai</h2>
                 <p className="mx-auto max-w-xl text-sm sm:text-base md:text-xl font-medium text-white/50 leading-relaxed" dir="auto">
                    Join the engineering team behind the most advanced real estate intelligence platform in the region.
                 </p>
                 <button className="inline-flex items-center justify-center rounded-full bg-white px-8 md:px-10 py-3 md:py-4 text-sm font-bold text-black transition-all hover:opacity-90 active:scale-95">
                    Explore Open Roles
                 </button>
             </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
