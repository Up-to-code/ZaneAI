"use client";

import * as React from "react";
import { CheckIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/i18n";

type DropdownContextValue = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  close: () => void;
  rootRef: React.RefObject<HTMLDivElement | null>;
};

const DropdownMenuContext = React.createContext<DropdownContextValue | null>(null);

function useDropdownMenuContext() {
  const context = React.useContext(DropdownMenuContext);
  if (!context) {
    throw new Error("DropdownMenu components must be used inside <DropdownMenu>.");
  }
  return context;
}

function composeHandlers<T extends React.SyntheticEvent>(
  first?: (event: T) => void,
  second?: (event: T) => void,
) {
  return (event: T) => {
    first?.(event);
    if (!event.defaultPrevented) {
      second?.(event);
    }
  };
}

function getChildrenArray(children: React.ReactNode) {
  return React.Children.toArray(children);
}

function cloneWithClassName<P extends { className?: string }>(
  element: React.ReactElement<P>,
  className: string,
  extraProps?: Partial<P>,
) {
  return React.cloneElement(element, {
    ...extraProps,
    className: cn(element.props.className, className),
  } as P);
}

function DropdownMenu({ children }: React.PropsWithChildren) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!open || !rootRef.current) {
        return;
      }
      if (rootRef.current.contains(event.target as Node)) {
        return;
      }
      setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, close: () => setOpen(false), rootRef }}>
      <div ref={rootRef} data-slot="dropdown-menu" className="relative inline-flex">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

function DropdownMenuPortal({ children }: React.PropsWithChildren) {
  return <>{children}</>;
}

function DropdownMenuTrigger({
  render,
}: {
  render: React.ReactElement;
}) {
  const { open, setOpen } = useDropdownMenuContext();
  const trigger = render as React.ReactElement<Record<string, any>>;
  return React.cloneElement(trigger, {
    "data-slot": "dropdown-menu-trigger",
    "aria-expanded": open,
    onClick: composeHandlers(trigger.props.onClick, () => setOpen((current) => !current)),
  });
}

function DropdownMenuContent({
  align = "start",
  sideOffset = 4,
  className,
  children,
}: React.PropsWithChildren<{
  align?: "start" | "end" | "center";
  alignOffset?: number;
  side?: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
  className?: string;
}>) {
  const { open, close } = useDropdownMenuContext();

  if (!open) {
    return null;
  }

  const alignmentClasses =
    align === "end" ? "right-0" : align === "center" ? "left-1/2 -translate-x-1/2" : "left-0";

  return (
    <div
      data-slot="dropdown-menu-content"
      className={cn(
        "absolute top-full z-50 mt-0.5 min-w-32 rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-none",
        alignmentClasses,
        sideOffset > 0 ? `mt-${Math.min(sideOffset, 4)}` : undefined,
        className,
      )}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          close();
        }
      }}
    >
      {children}
    </div>
  );
}

function DropdownMenuGroup({ children }: React.PropsWithChildren) {
  return <div data-slot="dropdown-menu-group">{children}</div>;
}

function DropdownMenuLabel({
  className,
  inset,
  children,
}: React.PropsWithChildren<{
  className?: string;
  inset?: boolean;
}>) {
  return (
    <div
      className={cn("px-1.5 py-1 text-xs font-medium text-muted-foreground", inset ? "pl-7" : undefined, className)}
      data-inset={inset}
      data-slot="dropdown-menu-label"
    >
      {children}
    </div>
  );
}

function DropdownMenuItem({
  children,
  className,
  inset,
  variant = "default",
  render,
  ...props
}: React.PropsWithChildren<
  {
    className?: string;
    inset?: boolean;
    variant?: "default" | "destructive";
    render?: React.ReactElement;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
>) {
  const { close } = useDropdownMenuContext();
  const itemClassName = cn(
    "group/dropdown-menu-item relative flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-none select-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
    inset ? "pl-7" : undefined,
    variant === "destructive" ? "text-destructive" : undefined,
    className,
  );

  if (render) {
    const item = render as React.ReactElement<Record<string, any>>;
    return React.cloneElement(item, {
      "data-slot": "dropdown-menu-item",
      "data-inset": inset,
      "data-variant": variant,
      className: cn(item.props.className, itemClassName),
      onClick: composeHandlers(item.props.onClick, (event: React.MouseEvent) => {
        props.onClick?.(event as never);
        close();
      }),
      children,
    });
  }

  return (
    <button
      type="button"
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={itemClassName}
      onClick={(event) => {
        props.onClick?.(event);
        close();
      }}
      {...props}
    >
      {children}
    </button>
  );
}

function DropdownMenuSub({ children }: React.PropsWithChildren) {
  return <>{children}</>;
}

function DropdownMenuSubTrigger({
  children,
  className,
  inset,
  ...props
}: React.PropsWithChildren<{ className?: string; inset?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      type="button"
      className={cn(
        "flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-none select-none focus:bg-accent focus:text-accent-foreground",
        inset ? "pl-7" : undefined,
        className,
      )}
      data-inset={inset}
      data-slot="dropdown-menu-sub-trigger"
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto" />
    </button>
  );
}

function DropdownMenuSubContent({
  className,
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return <div className={cn("pl-2", className)}>{children}</div>;
}

function DropdownMenuCheckboxItem({
  checked,
  children,
  className,
  inset,
  ...props
}: React.PropsWithChildren<
  {
    checked?: boolean;
    className?: string;
    inset?: boolean;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
>) {
  return (
    <DropdownMenuItem
      className={cn("pr-8", className)}
      data-inset={inset}
      {...props}
    >
      <span
        className="pointer-events-none absolute right-2 flex items-center justify-center"
        data-slot="dropdown-menu-checkbox-item-indicator"
      >
        {checked ? <CheckIcon /> : null}
      </span>
      {children}
    </DropdownMenuItem>
  );
}

function DropdownMenuRadioGroup({ children }: React.PropsWithChildren) {
  return <div data-slot="dropdown-menu-radio-group">{children}</div>;
}

function DropdownMenuRadioItem({
  children,
  className,
  inset,
  ...props
}: React.PropsWithChildren<
  {
    className?: string;
    inset?: boolean;
  } & React.ButtonHTMLAttributes<HTMLButtonElement>
>) {
  return (
    <DropdownMenuItem className={cn("pr-8", className)} data-inset={inset} {...props}>
      <span
        className="pointer-events-none absolute right-2 flex items-center justify-center"
        data-slot="dropdown-menu-radio-item-indicator"
      >
        <CheckIcon />
      </span>
      {children}
    </DropdownMenuItem>
  );
}

function DropdownMenuSeparator({
  className,
}: {
  className?: string;
}) {
  return <div className={cn("-mx-1 my-1 h-px bg-border", className)} data-slot="dropdown-menu-separator" />;
}

function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return <span className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)} {...props} />;
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
