import AgComingSoon from "../../_components/AgUi/AgComingSoon";
import { UsersRound } from "lucide-react";

export default async function WorkspaceCrmRoute() {
  return (
    <AgComingSoon 
      title="إدارة العملاء والشركاء" 
      description="نحن نعمل على بناء نظام إدارة علاقات عملاء (CRM) متكامل، يتيح لك متابعة العملاء المحتملين، وإدارة محفظة عملائك، وتتبع نشاط فريقك في مكان واحد."
      eyebrow="CRM قيد التطوير"
      icon={UsersRound}
    />
  );
}
