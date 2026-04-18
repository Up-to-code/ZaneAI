import { getWebDictionary } from "../../../../../packages/ag-ui/src/zaneai/i18n";
// Note: In a real app we might use expo-localization to detect the locale
// and store it in Zustand. For now, we'll implement a simple getter.

export type AppLocale = "ar" | "en" | "fr";

export const getDictionary = (locale: AppLocale = "ar") => {
  return getWebDictionary(locale);
};

/**
 * Hook to use translations in components.
 * Standardizing on Arabic as the default for the current branding phase.
 */
export function useTranslation() {
  // Switched to 'en' as default per user request.
  const locale: AppLocale = "en";
  const dict = getDictionary(locale);
  
  return {
    t: dict,
    locale,
    isRTL: (locale as string) === "ar",
  };
}
