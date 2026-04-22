import { getWebDictionary } from "../../../../../packages/ag-ui/src/zaneai/i18n";

export type AppLocale = "ar" | "en" | "fr";

function getDeviceLocale(): AppLocale {
  const locale = Intl.DateTimeFormat().resolvedOptions().locale?.toLowerCase() ?? "en";
  if (locale.startsWith("ar")) return "ar";
  if (locale.startsWith("fr")) return "fr";
  return "en";
}

export const getDictionary = (locale: AppLocale = getDeviceLocale()) => {
  return getWebDictionary(locale);
};

export function useTranslation() {
  const locale = getDeviceLocale();
  const dict = getDictionary(locale);

  return {
    t: dict,
    locale,
    isRTL: locale === "ar",
  };
}
