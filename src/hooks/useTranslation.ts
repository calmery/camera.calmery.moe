import _useTranslation from "next-translate/useTranslation";
import json from "../../locales/ja/common.json";

// Types

type Join<T, U> = T extends string
  ? U extends string
    ? `${T}${U extends "" ? "" : "."}${U}`
    : never
  : never;

type Paths<T> = T extends Record<string, unknown>
  ? { [K in keyof T]: K extends string ? Join<K, Paths<T[K]>> : never }[keyof T]
  : "";

export type Translation<T extends Record<string, unknown>> = (
  key: Paths<T>
) => string;

// Hooks

export const useTranslation = () => {
  const { t } = _useTranslation("common");
  return { t: t as Translation<typeof json> };
};
