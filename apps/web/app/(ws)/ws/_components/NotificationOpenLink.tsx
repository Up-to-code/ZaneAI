"use client";

import Link from "next/link";

type NotificationOpenLinkViewProps = {
  notificationId: string;
  href: string;
  isRead: boolean;
  className?: string;
  children: React.ReactNode;
};

/**
 * WHY:   Demo notification rows should still navigate consistently without a live backend mutation.
 * WHAT:  Renders the shared activation surface as a plain client-side link.
 * HOW:   Keeps the same props contract so notification pages and toasts stay unchanged.
 */
export function NotificationOpenLinkView({
  href,
  className,
  children,
}: NotificationOpenLinkViewProps) {
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default function NotificationOpenLink(props: NotificationOpenLinkViewProps) {
  return <NotificationOpenLinkView {...props} />;
}
