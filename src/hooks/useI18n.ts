import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import type { Split } from "type-fest";
import {
  defaultLocale,
  i18next,
  locales,
  type I18nKey,
  type I18nLocale,
  type I18nPreferredDictionary,
} from "~/libs/i18n";

// Types

type I18nOptions<T> = T extends `${string}{{${infer Param}}}${infer Tail}`
  ? { [k in Param | keyof I18nOptions<Tail>]: number | string }
  : T extends `${string}{{${infer Param}}}${string}`
  ? { [k in Param]: number | string }
  : {};

type TranslatedText<
  DictionaryOrValue,
  Keys extends string[]
> = DictionaryOrValue extends Record<string, unknown>
  ? TranslatedText<
      DictionaryOrValue[Keys[0]],
      Keys extends [infer _, ...infer T] ? T : []
    >
  : DictionaryOrValue;

// Main

export const useI18n = () => {
  const locale = useRouter().locale as I18nLocale;
  const i18n = useMemo(() => i18next.cloneInstance({ lng: locale }), [locale]);
  const t = useCallback(
    <
      Key extends I18nKey,
      Options extends I18nOptions<
        TranslatedText<I18nPreferredDictionary, Split<Key, ".">>
      >
    >(
      ...props: keyof Options extends never ? [Key] : [Key, Options]
    ) => {
      return i18n.t(props[0], props[1] || {});
    },
    [i18n]
  );

  return {
    defaultLocale,
    locale,
    locales,
    t,
  };
};
