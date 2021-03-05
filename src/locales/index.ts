import _rosetta from "rosetta";
import en from "./en.json";
import ja from "./ja.json";

/* --- Configuration --- */

export const defaultLocale: Locale = "ja";

export const locales = ["en", "ja"] as const;

/* --- Types --- */

type Join<T, U> = T extends string
  ? U extends string
    ? `${T}${U extends "" ? "" : "."}${U}`
    : never
  : never;

type Paths<T> = T extends Record<string, unknown>
  ? { [K in keyof T]: K extends string ? Join<K, Paths<T[K]>> : never }[keyof T]
  : "";

type Translation = typeof en & typeof ja;

// Exports

export type Locale = typeof locales[number];

/* --- Main --- */

const dictionary: { [key in Locale]: Translation } = { en, ja };

// Rosetta

const rosetta = _rosetta(dictionary);

// Exports

export const setLocale = (locale: Locale) => {
  rosetta.locale(locale);
};

export const t = (key: Paths<Translation>) => rosetta.t(key);
