import AgComingSoon from "../../_components/AgUi/AgComingSoon";
import { BriefcaseBusiness } from "lucide-react";

export default async function WorkspaceOffersRoute() {
  return (
    <AgComingSoon 
      title="العروض وطلبات الشراء" 
      description="منطقة مخصصة لتتبع العروض المقدمة على وحداتك، والتنسيق بين الأطراف المختلفة لإتمام الصفقات. سنقوم بإطلاق نظام إدارة العروض المتطور قريباً لتنظيم حركة المبيعات لديك."
      eyebrow="العروض قيد التطوير"
      icon={BriefcaseBusiness}
    />
  );
}
