import { Section, SectionLabel } from "@/components/ui/portal";
import { cookies } from "next/headers";
import { resolveLocale, WEB_LOCALE_COOKIE, getWebDictionary } from "@anan/ag-ui/anan";
import { Users, Linkedin, Mail, Twitter } from "lucide-react";

const TEAM_MEMBERS = [
  { name: "Ahmed Mansour", role: "CEO & Founder", bio: "Leading the architectural vision of Zane-AI and institutional real estate intelligence.", image: null },
  { name: "Sarah Chen", role: "Head of AI", bio: "Architecting the predictive models and intelligence layers powering the portal.", image: null },
  { name: "Marcus Stone", role: "Director of Operations", bio: "Ensuring seamless coordination between developers and brokers globally.", image: null },
  { name: "Elena Rossi", role: "Chief Design Officer", bio: "The visionary behind the Pure Canvas aesthetic and institutional UI.", image: null },
];

export default async function TeamPage() {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(WEB_LOCALE_COOKIE)?.value);
  const dictionary = getWebDictionary(locale);

  return (
    <main className="bg-background pt-24 md:pt-32">
      <Section className="py-24">
        <div className="mx-auto max-w-7xl px-6 space-y-16">
          <div className="space-y-8 max-w-3xl">
             <SectionLabel icon={Users} textClassName="text-xs font-black uppercase tracking-widest">
                {dictionary.footer.team}
             </SectionLabel>
             <h1 className="text-5xl font-black md:text-8xl tracking-tighter">
                Meet the <span className="text-primary">Visionaries.</span>
             </h1>
             <p className="text-lg md:text-xl font-bold text-muted-foreground leading-relaxed">
                A collective of architects, engineers, and visionaries dedicated to building the unified operating system for real estate.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {TEAM_MEMBERS.map((member, i) => (
              <div key={i} className="group relative rounded-[40px] border border-border bg-slate-50 dark:bg-slate-900 p-8 space-y-8 transition-all hover:bg-slate-100 dark:hover:bg-slate-800">
                 <div className="aspect-square w-full rounded-2xl bg-zinc-200 dark:bg-zinc-800 overflow-hidden flex items-center justify-center grayscale group-hover:grayscale-0 transition-all">
                    <Users className="h-16 w-16 text-zinc-400 opacity-20" />
                 </div>
                 <div className="space-y-2 text-right">
                    <h3 className="text-2xl font-black">{member.name}</h3>
                    <p className="text-sm font-black text-primary uppercase tracking-widest">{member.role}</p>
                 </div>
                 <p className="text-sm font-semibold text-muted-foreground leading-relaxed text-right rtl:text-right">
                    {member.bio}
                 </p>
                 <div className="flex items-center gap-4 pt-4 border-t border-border justify-end">
                    <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                    <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                    <Mail className="h-5 w-5 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
                 </div>
              </div>
            ))}
          </div>

          <div className="rounded-[48px] bg-primary p-12 md:p-24 text-center text-white space-y-10">
             <h2 className="text-4xl md:text-6xl font-black tracking-tight">{dictionary.footer.careers}</h2>
             <p className="mx-auto max-w-xl text-lg font-medium text-white/80">
                Join the engineering team behind the most advanced real estate intelligence platform in the region.
             </p>
             <button className="inline-flex items-center justify-center rounded-full bg-white px-12 py-5 text-sm font-black tracking-wide text-primary transition-all hover:bg-white/90 active:scale-95">
                Explore Open Roles
             </button>
          </div>
        </div>
      </Section>
    </main>
  );
}
