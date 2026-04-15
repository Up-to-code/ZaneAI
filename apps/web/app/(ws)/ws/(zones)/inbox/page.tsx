type InboxIndexPageProps = {
  searchParams: Promise<{
    conversationId?: string;
    startUserId?: string;
  }>;
};

import AgComingSoon from "../../_components/AgUi/AgComingSoon";
import { Mail } from "lucide-react";

export default async function InboxIndexPage() {
  return (
    <AgComingSoon 
      title="صندوق الوارد والتواصل" 
      description="منطقة مركزية لإدارة جميع محادثاتك مع المطورين، العملاء، والوسطاء. سيتم إطلاق نظام المراسلة المتطور قريباً ليدعم التنسيق الفوري ومشاركة العروض."
      eyebrow="الرسائل قيد التطوير"
      icon={Mail}
    />
  );
}
