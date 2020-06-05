import { PresetFilter } from "~/types/PresetFilter";

// https://silvia-odwyer.github.io/photon/
// silvia-odwyer/photon: Rust/WebAssembly image processing library (https://github.com/silvia-odwyer/photon)
// https://github.com/silvia-odwyer/photon/blob/4db0d5912a3ab7231bf5109ba0628f843d5a4872/crate/src/filters.rs#L107-L146
// https://github.com/silvia-odwyer/photon/blob/4db0d5912a3ab7231bf5109ba0628f843d5a4872/crate/src/colour_spaces.rs#L575-L599

// Photon のフィルターの値を使っている
export const PRESET_FILTERS: {
  [key in PresetFilter]: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
} = {
  [PresetFilter.OCEANIC]: {
    r: 0,
    g: 89,
    b: 173,
    a: 0.2,
  },
  [PresetFilter.ISLANDS]: {
    r: 0,
    g: 24,
    b: 95,
    a: 0.2,
  },
  [PresetFilter.MARINE]: {
    r: 0,
    g: 14,
    b: 119,
    a: 0.2,
  },
  [PresetFilter.SEAGREEN]: {
    r: 0,
    g: 68,
    b: 62,
    a: 0.2,
  },
  [PresetFilter.FLAGBLUE]: {
    r: 0,
    g: 0,
    b: 131,
    a: 0.2,
  },
  [PresetFilter.DIAMANTE]: {
    r: 30,
    g: 82,
    b: 87,
    a: 0.1,
  },
  [PresetFilter.LIQUID]: {
    r: 0,
    g: 10,
    b: 75,
    a: 0.2,
  },
  [PresetFilter.VINTAGE]: {
    r: 120,
    g: 70,
    b: 13,
    a: 0.2,
  },
  [PresetFilter.PERFUME]: {
    r: 80,
    g: 40,
    b: 120,
    a: 0.2,
  },
  [PresetFilter.SERENITY]: {
    r: 10,
    g: 40,
    b: 90,
    a: 0.2,
  },
};
