import { useRouter } from "next/router";
import { Locale, setLocale, t } from "~/locales";

export const useTranslation = () => {
  const router = useRouter();
  const locale = router.locale as Locale;
  const locales = router.locales as Locale[];

  setLocale(locale);

  return { locale, locales, t };
};
