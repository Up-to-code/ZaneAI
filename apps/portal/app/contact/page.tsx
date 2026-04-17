import { PageHero, Section, SectionLabel } from "@/components/ui/portal";
import { cookies } from "next/headers";
import { resolveLocale, WEB_LOCALE_COOKIE, getWebDictionary } from "@zaneai/ag-ui/zaneai";
import { Mail, MapPin, Phone, MessageSquare } from "lucide-react";

export default async function ContactPage() {
  const cookieStore = await cookies();
  const locale = resolveLocale(cookieStore.get(WEB_LOCALE_COOKIE)?.value);
  const dictionary = getWebDictionary(locale);

  return (
    <main className="bg-background pt-24 md:pt-32">
      <Section className="pb-0">
        <PageHero
          badge={
            <SectionLabel icon={MessageSquare}>
              Get in Touch
            </SectionLabel>
          }
          title={
            <span className="text-5xl font-black uppercase tracking-tight sm:text-7xl lg:text-8xl">
              Connect with <span className="text-primary">Intelligence.</span>
            </span>
          }
          description={
            <p className="mx-auto max-w-2xl text-lg font-bold text-muted-foreground md:text-xl">
              Whether you're looking for institutional infrastructure or have a partnership inquiry, our team is ready to assist.
            </p>
          }
          contentClassName="mx-auto max-w-6xl space-y-12 px-6 text-center"
        />
      </Section>

      <Section className="py-32">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2">
          {/* Contact Details */}
          <div className="space-y-12">
            <h2 className="text-4xl font-black tracking-tight">Direct Support Channels</h2>
            <div className="grid gap-8">
               <div className="flex items-start gap-6 p-8 rounded-[32px] border border-border bg-slate-50 dark:bg-slate-900/50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Sales & Partnerships</h3>
                    <p className="text-xl font-bold mt-1">partners@zane-ai.com</p>
                  </div>
               </div>
               <div className="flex items-start gap-6 p-8 rounded-[32px] border border-border bg-slate-50 dark:bg-slate-900/50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Operational Support</h3>
                    <p className="text-xl font-bold mt-1">+971 4 000 0000</p>
                  </div>
               </div>
               <div className="flex items-start gap-6 p-8 rounded-[32px] border border-border bg-slate-50 dark:bg-slate-900/50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Dubai Office</h3>
                    <p className="text-xl font-bold mt-1">DIFC Innovation Hub, Dubai, UAE</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="relative rounded-[48px] bg-slate-950 p-10 lg:p-14 text-white shadow-2xl">
              <form className="space-y-8">
                 <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                       <label className="text-xs font-black uppercase tracking-widest opacity-60">Full Name</label>
                       <input type="text" className="w-full rounded-2xl bg-white/5 border border-white/10 p-4 focus:outline-none focus:border-primary transition-colors" placeholder="Ahmed Mansour" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-xs font-black uppercase tracking-widest opacity-60">Company</label>
                       <input type="text" className="w-full rounded-2xl bg-white/5 border border-white/10 p-4 focus:outline-none focus:border-primary transition-colors" placeholder="Zane Real Estate" />
                    </div>
                 </div>
                 <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest opacity-60">Email Address</label>
                    <input type="email" className="w-full rounded-2xl bg-white/5 border border-white/10 p-4 focus:outline-none focus:border-primary transition-colors" placeholder="ahmed@zane-ai.com" />
                 </div>
                 <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest opacity-60">Message</label>
                    <textarea rows={4} className="w-full rounded-2xl bg-white/5 border border-white/10 p-4 focus:outline-none focus:border-primary transition-colors" placeholder="Tell us about your institutional needs..." />
                 </div>
                 <button className="w-full rounded-full bg-primary py-5 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-primary/90 active:scale-95">
                    Send Inquiry
                 </button>
              </form>
          </div>
        </div>
      </Section>
    </main>
  );
}
