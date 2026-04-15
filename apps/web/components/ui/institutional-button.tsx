"use client";

import { ReactNode } from "react";

interface ButtonProps {
    children: ReactNode;
    variant?: "primary" | "outline" | "ghost" | "dark" | "white";
    className?: string;
    onClick?: () => void;
    type?: "button" | "submit";
    href?: string;
    disabled?: boolean;
}

/**
 * WHY:   Public auth and consent flows need one consistent institutional button without binding them to a specific zone folder.
 * WHAT:  Renders the branded button variants used by sign-in and consent surfaces.
 * HOW:   Shares one style map for anchor and button rendering while staying framework-light.
 */
export default function Button({
    children,
    variant = "primary",
    className = "",
    onClick,
    type = "button",
    href,
    disabled = false,
}: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center rounded-full font-black uppercase tracking-[0.18em] transition-all active:scale-[0.98]";
    const variants = {
        primary: "bg-[var(--zayon-accent)] px-8 py-3 text-xs text-white shadow-[0_18px_48px_rgba(255,61,0,0.24)] hover:bg-[color:color-mix(in_srgb,var(--zayon-accent)_88%,black)]",
        outline: "border border-[color:var(--zayon-line)] bg-transparent px-10 py-4 text-sm text-[var(--zayon-deep)] hover:border-[var(--zayon-accent)] hover:bg-[var(--zayon-accent-soft)]",
        ghost: "border border-transparent px-6 py-3 text-xs text-[var(--zayon-deep)] hover:border-[color:var(--zayon-line)] hover:bg-white/70",
        dark: "bg-[var(--zayon-deep)] px-10 py-4 text-sm text-white hover:bg-[var(--zayon-surface)]",
        white: "bg-white px-10 py-4 text-sm text-[var(--zayon-deep)] hover:bg-[var(--zayon-accent-soft)]"
    };
    const content = <span className="flex items-center gap-3">{children}</span>;
    if (href) {
        return <a href={href} className={`${baseStyles} ${variants[variant]} ${className}`}>{content}</a>;
    }
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant]} ${className} ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
        >
            {content}
        </button>
    );
}
