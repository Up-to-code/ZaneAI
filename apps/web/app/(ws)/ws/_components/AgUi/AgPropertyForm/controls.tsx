import type { UploadedFileReference } from "@/server/contracts/files";

export function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="py-2">
      <div className="mb-8 text-right">
        <h3 className="text-2xl font-black tracking-tight text-foreground">{title}</h3>
        {description ? <p className="mt-3 text-[15px] leading-8 text-[var(--workspace-muted)]">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="mb-2.5 block text-[11px] font-black uppercase tracking-[0.2em] text-[var(--workspace-muted)]">{children}</label>;
}

export function TextInput({
  value,
  onChange,
  placeholder,
  icon,
  type = "text",
  disabled = false,
  className,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon?: React.ReactNode;
  type?: "text" | "number";
  disabled?: boolean;
  className?: string;
  error?: string;
}) {
  return (
    <div className={`grid gap-2 ${className}`}>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          className={`h-[68px] w-full rounded-[24px] border bg-[var(--workspace-panel)] px-6 text-[15px] font-black tracking-tight text-foreground outline-none transition-all placeholder:text-[color:color-mix(in_srgb,var(--workspace-muted)_76%,transparent)] focus:border-[color:color-mix(in_srgb,var(--workspace-highlight)_28%,var(--workspace-border))] focus:bg-[var(--workspace-elevated)] focus:ring-4 focus:ring-foreground/5 disabled:cursor-not-allowed disabled:opacity-50 ${
            error ? "border-rose-300 focus:border-rose-400 focus:ring-rose-500/10" : "border-[color:var(--workspace-border)]"
          }`}
        />
        {icon ? <div className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 text-[var(--workspace-muted)]">{icon}</div> : null}
      </div>
      {error ? <p className="text-sm font-semibold text-rose-700">{error}</p> : null}
    </div>
  );
}

export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 4,
  error,
  disabled = false,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  rows?: number;
  error?: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div className={`grid gap-2 ${className}`}>
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        className={`w-full resize-none rounded-[24px] border bg-[var(--workspace-panel)] px-6 py-5 text-[15px] font-black tracking-tight leading-8 text-foreground outline-none transition-all placeholder:text-[color:color-mix(in_srgb,var(--workspace-muted)_76%,transparent)] focus:border-[color:color-mix(in_srgb,var(--workspace-highlight)_28%,var(--workspace-border))] focus:bg-[var(--workspace-elevated)] focus:ring-4 focus:ring-foreground/5 ${
          error ? "border-rose-300 focus:border-rose-400 focus:ring-rose-500/10" : "border-[color:var(--workspace-border)]"
        }`}
      />
      {error ? <p className="text-sm font-semibold text-rose-700">{error}</p> : null}
    </div>
  );
}

export function UploadTile({
  title,
  subtitle,
  onClick,
  icon,
  disabled = false,
}: {
  title: string;
  subtitle?: string;
  onClick: () => void;
  icon: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center justify-between gap-4 rounded-[24px] border border-dashed border-[color:var(--workspace-border)] bg-[var(--workspace-panel)] px-6 py-6 text-right transition hover:border-[color:color-mix(in_srgb,var(--workspace-highlight)_22%,var(--workspace-border))] hover:bg-[var(--workspace-elevated)] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <div className="text-right">
        <div className="text-[15px] font-black text-foreground">{title}</div>
        {subtitle ? <div className="mt-1 text-xs font-semibold text-[var(--workspace-muted)]">{subtitle}</div> : null}
      </div>
      <div className="text-[var(--workspace-muted)]">{icon}</div>
    </button>
  );
}

export function ReviewRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[20px] border border-[color:var(--workspace-border)] bg-[var(--workspace-panel)] px-5 py-4 text-right">
      <div className="text-[15px] font-black text-foreground">{value}</div>
      <div className="text-xs font-black uppercase tracking-[0.18em] text-[var(--workspace-muted)]">{label}</div>
    </div>
  );
}

export function BrokerAvatar({
  avatarImage,
  avatarLabel,
}: {
  avatarImage?: string | null;
  avatarLabel: string;
}) {
  return (
    <div className="h-11 w-11 overflow-hidden rounded-[16px] border border-[color:var(--workspace-border)] bg-[var(--workspace-panel)]">
      {avatarImage ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={avatarImage} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm font-black text-[var(--workspace-muted)]">
          {avatarLabel}
        </div>
      )}
    </div>
  );
}

export function FileRow({
  file,
  onRemove,
}: {
  file: UploadedFileReference;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[20px] border border-[color:var(--workspace-border)] bg-[var(--workspace-panel)] px-5 py-4">
      <button
        type="button"
        onClick={onRemove}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--workspace-border)] bg-[var(--workspace-elevated)] text-[var(--workspace-muted)] transition hover:border-[color:color-mix(in_srgb,var(--workspace-highlight)_28%,transparent)] hover:text-foreground"
      >
        ×
      </button>
      <div className="truncate text-sm font-bold text-foreground">{file.name}</div>
    </div>
  );
}
