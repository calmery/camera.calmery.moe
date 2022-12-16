import i18next from "i18next";
import type { LiteralToPrimitive } from "type-fest";
import en from "~/libs/i18n/en";
import ja from "~/libs/i18n/ja";

// Types

type Join<T, U> = T extends string
  ? U extends string
    ? `${T}${U extends "" ? "" : "."}${U}`
    : never
  : never;

type LiteralToPrimitiveDeep<T> = T extends object
  ? { [P in keyof T]: LiteralToPrimitiveDeep<T[P]> }
  : LiteralToPrimitive<T>;

type Paths<T> = T extends Record<string, unknown>
  ? { [K in keyof T]: K extends string ? Join<K, Paths<T[K]>> : never }[keyof T]
  : "";

// Main

export type I18nKey = Paths<typeof ja>;

export type I18nLocale = "en" | "ja";

export type I18nPreferredDictionary = typeof ja;

// `defaultLocale` を変更するときは next.config.js も忘れずに変更する
export const defaultLocale: I18nLocale = "ja";

// `locales` を変更するときは next.config.js も忘れずに変更する
export const locales: I18nLocale[] = ["en", "ja"];

const resources: {
  en: { translation: LiteralToPrimitiveDeep<typeof ja> };
  ja: { translation: LiteralToPrimitiveDeep<typeof ja> };
} = {
  en: { translation: en },
  ja: { translation: ja },
};

i18next.init({
  fallbackLng: defaultLocale,
  resources,
  supportedLngs: locales,
  interpolation: { escapeValue: false },
});

export { i18next };
