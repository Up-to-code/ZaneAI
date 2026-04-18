import { Section } from "@/components/ui/portal";
import { cookies } from "next/headers";
import { resolveLocale, WEB_LOCALE_COOKIE, getWebDictionary } from "@zaneai/ag-ui/zaneai";
import { Mail, MapPin, Phone, MessageSquare } from "lucide-react";

export default async function ContactPage() {
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
                Get in Touch
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-[5.5rem] font-bold tracking-tighter text-foreground leading-[1.05]" dir="auto">
              Connect with <br/> Intelligence.
            </h1>
            <p className="text-lg md:text-xl font-medium leading-relaxed text-muted-foreground max-w-2xl mx-auto pt-2" dir="auto">
              Whether you're looking for institutional infrastructure or have a partnership inquiry, our team is ready to assist.
            </p>
          </div>
        </div>
      </Section>

      <Section className="py-16 md:py-24 bg-slate-50/50 dark:bg-zinc-950/20 relative overflow-hidden">
        <div className="absolute top-1/4 start-1/4 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="mx-auto grid max-w-[1400px] gap-10 md:gap-16 px-4 sm:px-6 lg:px-10 lg:grid-cols-2">
          {/* Contact Details */}
          <div className="space-y-8 md:space-y-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter text-foreground" dir="auto">Direct Support Channels</h2>
            <div className="grid gap-6">
               <div className="flex items-start sm:items-center gap-4 sm:gap-6 p-5 sm:p-8 rounded-3xl md:rounded-[2rem] border border-border bg-white dark:bg-black shadow-sm group hover:border-black/20 dark:hover:border-zinc-700 transition-all isolate [transform:translateZ(0)]">
                  <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-2xl bg-primary/5 text-primary group-hover:scale-110 transition-transform shrink-0">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-muted-foreground mb-1" dir="auto">Sales & Partnerships</h3>
                    <p className="text-base sm:text-xl font-bold text-foreground" dir="auto">partners@zane-ai.com</p>
                  </div>
               </div>
               <div className="flex items-start sm:items-center gap-4 sm:gap-6 p-5 sm:p-8 rounded-3xl md:rounded-[2rem] border border-border bg-white dark:bg-black shadow-sm group hover:border-black/20 dark:hover:border-zinc-700 transition-all isolate [transform:translateZ(0)]">
                  <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-2xl bg-primary/5 text-primary group-hover:scale-110 transition-transform shrink-0">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-muted-foreground mb-1" dir="auto">Operational Support</h3>
                    <p className="text-base sm:text-xl font-bold text-foreground" dir="auto">+971 4 000 0000</p>
                  </div>
               </div>
               <div className="flex items-start sm:items-center gap-4 sm:gap-6 p-5 sm:p-8 rounded-3xl md:rounded-[2rem] border border-border bg-white dark:bg-black shadow-sm group hover:border-black/20 dark:hover:border-zinc-700 transition-all isolate [transform:translateZ(0)]">
                  <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-2xl bg-primary/5 text-primary group-hover:scale-110 transition-transform shrink-0">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-muted-foreground mb-1" dir="auto">Dubai Office</h3>
                    <p className="text-base sm:text-xl font-bold text-foreground" dir="auto">DIFC Innovation Hub, Dubai, UAE</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="relative rounded-3xl md:rounded-[2.5rem] bg-zinc-950 border border-white/10 p-6 sm:p-10 lg:p-14 text-white shadow-2xl isolate [transform:translateZ(0)]">
              <form className="space-y-6">
                 <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                       <label className="text-sm font-medium text-white/70" dir="auto">Full Name</label>
                       <input type="text" className="w-full rounded-xl bg-white/5 border border-white/10 p-4 font-medium focus:outline-none focus:border-primary transition-colors text-white" placeholder="Ahmed Mansour" dir="auto" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-medium text-white/70" dir="auto">Company</label>
                       <input type="text" className="w-full rounded-xl bg-white/5 border border-white/10 p-4 font-medium focus:outline-none focus:border-primary transition-colors text-white" placeholder="Zane Real Estate" dir="auto" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70" dir="auto">Email Address</label>
                    <input type="email" className="w-full rounded-xl bg-white/5 border border-white/10 p-4 font-medium focus:outline-none focus:border-primary transition-colors text-white" placeholder="ahmed@zane-ai.com" dir="auto" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70" dir="auto">Message</label>
                    <textarea rows={4} className="w-full rounded-xl bg-white/5 border border-white/10 p-4 font-medium focus:outline-none focus:border-primary transition-colors text-white" placeholder="Tell us about your institutional needs..." dir="auto" />
                 </div>
                 <button className="w-full mt-4 rounded-full bg-primary py-4 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95">
                    Send Inquiry
                 </button>
              </form>
          </div>
        </div>
      </Section>
    </main>
  );
}
