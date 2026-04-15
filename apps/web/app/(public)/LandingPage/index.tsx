import { Hexagon, Lock, Eye, Zap, Layers, ChevronRight, Activity, Cpu } from "lucide-react";
import {
  ActionRow,
  ButtonLink,
  Section,
  SectionLabel,
} from "@/app/(public)/public";

/**
 * WHY:   The public homepage needs to convey immediate architectural power and precision.
 * WHAT:  A premium "Pure Canvas" landing page featuring a dense Bento grid, massive typography, and high-contrast OLED-ready panels.
 * HOW:   Deep architectural refactoring utilizing CSS grid and strict 1px stroke design systems.
 */
export default function LandingPage() {
  return (
    <main className="bg-background">
      {/* 
        ========================================
        1. MASSIVE STRUCTURAL HERO
        ======================================== 
      */}
      <Section className="relative overflow-hidden pt-32 pb-24 md:pt-48 md:pb-40 border-b border-border">
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
            
            {/* Left/RTL Typography Column */}
            <div className="lg:col-span-7 space-y-10 rtl:text-right text-left">
              <div className="inline-flex items-center gap-3">
                 <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                 <span className="text-xs font-black tracking-[0.1em] text-primary">الجيل الجديد من منصات العمل</span>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-[clamp(3.5rem,8vw,6rem)] font-black leading-[1.05] text-foreground dark:text-white">
                  مساحة عمل مشتركة <br />
                  <span className="text-primary">بلا تشتيت.</span>
                </h1>
                <p className="max-w-xl text-lg font-bold leading-relaxed text-slate-500 dark:text-slate-400 md:text-xl">
                  منصة هندسية دقيقة تجمع بين المخزون والتكوين والسياق المباشر. 
                  تخلص من فوضى المراسلات وابدأ العمل في مساحة تعتمد على التنظيم المطلق من النقطة صفر.
                </p>
              </div>

              <ActionRow className="flex flex-col gap-4 sm:flex-row pt-6">
                <ButtonLink href="/signin" variant="primary" className="px-12 py-5 text-sm h-auto justify-center">
                  فتح مساحة العمل
                </ButtonLink>
                <ButtonLink
                  href="#platform"
                  variant="outline"
                  className="px-12 py-5 text-sm h-auto justify-center"
                >
                  اكتشف المنصة <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                </ButtonLink>
              </ActionRow>
            </div>

            {/* Right/LTR Graphic Column */}
            <div className="lg:col-span-5 relative mt-8 lg:mt-0">
              <div className="aspect-video lg:aspect-square w-full max-w-[500px] mx-auto rounded-[40px] border border-border bg-slate-50 dark:bg-slate-900 p-8 flex items-center justify-center relative overflow-hidden group shadow-sm">
                {/* Structural Graphic Background */}
                <div className="absolute inset-0 z-0 opacity-20"
                     style={{ backgroundImage: "radial-gradient(circle at center, var(--border) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
                />
                
                {/* Spinning Geometric Core */}
                <div className="relative z-10 flex h-48 w-48 items-center justify-center rounded-3xl border border-primary/20 bg-primary/5 transition-transform duration-1000 ease-in-out group-hover:scale-110">
                   <div className="absolute inset-0 animate-[spin_10s_linear_infinite] rounded-3xl border border-primary/40 border-dashed"></div>
                   <div className="absolute inset-4 animate-[spin_15s_linear_infinite_reverse] rounded-2xl border border-primary/30"></div>
                   <Hexagon className="h-20 w-20 text-primary fill-primary/10 animate-pulse" strokeWidth={1} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </Section>

      {/* 
        ========================================
        2. PLATFORM METRICS STRIP
        ======================================== 
      */}
      <Section className="border-y border-border bg-slate-50 py-16 dark:bg-slate-950/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 divide-border rtl:divide-x-reverse lg:divide-x">
            <div className="space-y-3 text-center lg:px-8">
              <div className="text-5xl md:text-7xl font-black text-foreground dark:text-white tracking-tighter">100<span className="text-primary">%</span></div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">التزامن الفوري</div>
            </div>
            <div className="space-y-3 text-center lg:px-8">
              <div className="text-5xl md:text-7xl font-black text-foreground dark:text-white tracking-tighter">0<span className="text-primary">ms</span></div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">خسارة السياق</div>
            </div>
            <div className="space-y-3 text-center lg:px-8">
              <div className="text-5xl md:text-7xl font-black text-foreground dark:text-white tracking-tighter">∞</div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">حالات تفاوض</div>
            </div>
            <div className="space-y-3 text-center lg:px-8">
              <div className="flex items-center justify-center gap-2">
                <Lock className="h-10 w-10 md:h-14 md:w-14 text-foreground dark:text-white" strokeWidth={2.5}/>
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-4">تشفير مؤسسي</div>
            </div>
          </div>
        </div>
      </Section>

      {/* 
        ========================================
        3. THE BENTO GRID (PLATFORM CAPABILITIES)
        ======================================== 
      */}
      <Section id="platform" className="py-32 md:py-48">
        <div className="mx-auto max-w-7xl px-6 space-y-20">
          <div className="space-y-8 text-center max-w-3xl mx-auto">
            <SectionLabel
              icon={Hexagon}
              className="inline-flex items-center gap-3 rounded-full border border-border bg-slate-50 px-5 py-2 dark:bg-slate-900"
              iconClassName="h-5 w-5 text-primary fill-primary/20"
              textClassName="text-xs font-black uppercase tracking-widest text-foreground dark:text-white"
            >
              الهندسة الداخلية
            </SectionLabel>
            <h2 className="text-4xl font-black leading-[1.1] text-foreground dark:text-white md:text-6xl tracking-tight">
              لا مجـال للعشوائية.
            </h2>
            <p className="text-lg md:text-xl font-medium leading-relaxed text-muted-foreground">
              بُنيت منصة Zane-ai لتجمع المطور المبدع والوسيط المنفذ تحت هيكل واحد. واجهات سريعة، تحديثات لحظية، وصلاحيات دقيقة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">
            {/* Bento Block 1: Large Feature */}
            <div className="col-span-1 md:col-span-2 group relative overflow-hidden rounded-[32px] border border-border bg-slate-50 hover:bg-slate-100/50 dark:bg-slate-950 dark:hover:bg-slate-900 transition-colors p-10 md:p-14 flex flex-col justify-between">
              <div className="absolute right-0 top-0 opacity-5 dark:opacity-10 pointer-events-none transform translate-x-1/3 -translate-y-1/4">
                <Layers className="w-96 h-96 text-foreground" strokeWidth={0.5} />
              </div>
              <div className="relative z-10 space-y-8 max-w-lg rtl:ml-auto ltr:mr-auto text-right">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <Activity className="h-8 w-8 text-primary" strokeWidth={2.5}/>
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-black text-foreground dark:text-white tracking-tight">رؤية تشغيلية مركزية للمطور</h3>
                  <p className="text-lg font-bold text-muted-foreground leading-relaxed">
                    تنظيم المحفظة، مراقبة الطوابير وسحب العروض في واجهة واحدة نظيفة تغنيك عن جداول الحسابات المعقدة.
                  </p>
                </div>
              </div>
            </div>

            {/* Bento Block 2: Tall Feature */}
            <div className="col-span-1 md:row-span-2 group relative overflow-hidden rounded-[32px] border border-border bg-foreground text-background dark:bg-slate-900 dark:text-white hover:bg-slate-800 dark:hover:bg-slate-800 transition-colors p-10 flex flex-col justify-center text-center">
               <div className="space-y-8 relative z-10">
                <div className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
                  <Zap className="h-10 w-10 text-primary fill-primary/20" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-black tracking-tight">إيقاع سريع للوسيط</h3>
                  <p className="text-base md:text-lg font-bold text-slate-400 dark:text-slate-400 leading-relaxed">
                    متابعة منظمة للعروض والصفقات. كل شيء في مكانه الصحيح لدعم اتخاذ قرارات حاسمة بدون مماطلة.
                  </p>
                </div>
              </div>
            </div>

            {/* Bento Block 3: Standard Feature */}
            <div className="col-span-1 group relative overflow-hidden rounded-[32px] border border-border bg-slate-50 hover:bg-slate-100/50 dark:bg-slate-950 dark:hover:bg-slate-900 transition-colors p-10 flex flex-col justify-between">
              <div className="space-y-6 text-right">
                <Eye className="h-8 w-8 text-foreground dark:text-white" strokeWidth={2.5} />
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-foreground dark:text-white">سياق عالي الدقة</h3>
                  <p className="text-sm font-bold text-muted-foreground leading-relaxed">
                    المحادثات ليست نصوصاً فارغة، بل هي مرتبطة مباشرة بالمشاريع والوحدات. الزاوية الأهم دائماً ظاهرة.
                  </p>
                </div>
              </div>
            </div>

            {/* Bento Block 4: Standard Feature */}
            <div className="col-span-1 group relative overflow-hidden rounded-[32px] border border-border bg-slate-50 hover:bg-slate-100/50 dark:bg-slate-950 dark:hover:bg-slate-900 transition-colors p-10 flex flex-col justify-between">
              <div className="space-y-6 text-right">
                <Cpu className="h-8 w-8 text-foreground dark:text-white" strokeWidth={2.5} />
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-foreground dark:text-white">نظام مبني للمستقبل</h3>
                  <p className="text-sm font-bold text-muted-foreground leading-relaxed">
                    منصة Zane-ai تدعم التوسع. من وسطاء فرديين إلى وكالات ومطورين عالميين بتقسيمات دقيقة للصلاحيات.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 
        ========================================
        4. BOTTOM CTA
        ======================================== 
      */}
      <Section className="border-t border-primary/20 bg-primary py-32 text-center text-white md:py-48">
        <div className="mx-auto max-w-4xl space-y-12">
          <h2 className="text-5xl font-black uppercase leading-tight md:text-7xl tracking-tighter text-white">
            ادخل مساحة العمل.
          </h2>
          <p className="mx-auto max-w-xl text-xl font-medium leading-relaxed text-white/90">
            توقف عن إدارة البيانات عبر القنوات المشتتة، وانتقل لمركز العمليات الموحد.
          </p>
          <ActionRow className="flex flex-col justify-center gap-6 pt-10 sm:flex-row">
            <a
              href="/signin"
              className="inline-flex items-center justify-center rounded-full bg-white px-14 py-6 text-sm font-black tracking-wide text-primary transition-all hover:bg-white/90 active:scale-[0.98] dark:shadow-none"
            >
              أنشئ مساحتك الآن
            </a>
          </ActionRow>
        </div>
      </Section>
    </main>
  );
}
