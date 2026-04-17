import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type SectionProps = {
  className?: string;
  children?: ReactNode;
};

export function Section({ className, children }: SectionProps) {
  return <section className={cn("mx-auto w-full max-w-7xl px-6", className)}>{children}</section>;
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: "primary" | "outline";
  className?: string;
  children?: ReactNode;
};

export function ButtonLink({ variant = "primary", className, children, ...props }: ButtonLinkProps) {
  return (
    <Link
      {...props}
      className={cn(
        "inline-flex items-center justify-center transition",
        variant === "primary" ? "hover:opacity-90" : "hover:bg-black/5 dark:hover:bg-white/5",
        className,
      )}
    >
      {children}
    </Link>
  );
}

type NavbarProps = {
  className?: string;
};

export function Navbar({ className }: NavbarProps) {
  return (
    <header className={cn("relative z-20 border-b border-black/5 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-black/60", className)}>
      <Section className="flex h-16 items-center justify-between">
        <Link href="/" className="text-xs font-black uppercase tracking-[0.32em]">
          Zane-AI
        </Link>
        <Link href="/signin" className="text-sm font-semibold text-[var(--zane-ai-text-muted)]">
          Sign in
        </Link>
      </Section>
    </header>
  );
}

type FooterProps = {
  locale?: string;
  className?: string;
};

export function Footer({ locale, className }: FooterProps) {
  return (
    <footer className={cn("border-t border-black/5 py-8 text-center text-xs font-medium text-[var(--zane-ai-text-muted)] dark:border-white/10", className)}>
      <Section>
        <p>{locale === "ar" ? "Zane-AI" : "Zane-AI"} · Built for modern workspace flows.</p>
      </Section>
    </footer>
  );
}

type PageHeroProps = {
  badge?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  contentClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

export function PageHero({
  badge,
  title,
  description,
  contentClassName,
  titleClassName,
  descriptionClassName,
}: PageHeroProps) {
  return (
    <div className={cn("space-y-6", contentClassName)}>
      {badge ? <div>{badge}</div> : null}
      <div className="space-y-4">
        <h1 className={cn("text-3xl font-black tracking-tight", titleClassName)}>{title}</h1>
        {description ? <div className={cn("text-base leading-7", descriptionClassName)}>{description}</div> : null}
      </div>
    </div>
  );
}
