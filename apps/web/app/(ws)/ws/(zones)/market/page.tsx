import AgComingSoon from "../../_components/AgUi/AgComingSoon";
import { BarChart3 } from "lucide-react";

export default async function WorkspaceMarketRoute() {
  return (
    <AgComingSoon 
      title="ذكاء السوق والبيانات" 
      description="نحن نقوم بتحليل ملايين النقاط من البيانات لنوفر لك أدق الإحصائيات حول أسعار المتر، سرعة البيع، وتحليل الطلب في مختلف المناطق. هذه الميزة ستكون متاحة قريباً لمساعدتك في اتخاذ قرارات مبنية على بيانات حقيقية."
      eyebrow="Market Intelligence قيد التطوير"
      icon={BarChart3}
    />
  );
}
