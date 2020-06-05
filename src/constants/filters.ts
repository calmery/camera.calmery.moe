// https://silvia-odwyer.github.io/photon/
// silvia-odwyer/photon: Rust/WebAssembly image processing library (https://github.com/silvia-odwyer/photon)
// https://github.com/silvia-odwyer/photon/blob/4db0d5912a3ab7231bf5109ba0628f843d5a4872/crate/src/filters.rs#L107-L146
// https://github.com/silvia-odwyer/photon/blob/4db0d5912a3ab7231bf5109ba0628f843d5a4872/crate/src/colour_spaces.rs#L575-L599

export enum Filter {
  OCEANIC = "oceanic",
  ISLANDS = "islands",
  MARINE = "marine",
  SEAGREEN = "seagreen",
  FLAGBLUE = "flagblue",
  DIAMANTE = "diamante",
  LIQUID = "liquid",
  VINTAGE = "vintage", // mix_with_colour(img, vintage_rgb, 0.2)
  PERFUME = "perfume", // mix_with_colour(img, perfume_rgb, 0.2)
  SERENITY = "serenity", // mix_with_colour(img, serenity_rgb, 0.2)
}

// Photon のフィルターの値を使っている
export const FILTER_PRESETS: {
  [key in Filter]: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
} = {
  [Filter.OCEANIC]: {
    r: 0,
    g: 89,
    b: 173,
    a: 0.2,
  },
  [Filter.ISLANDS]: {
    r: 0,
    g: 24,
    b: 95,
    a: 0.2,
  },
  [Filter.MARINE]: {
    r: 0,
    g: 14,
    b: 119,
    a: 0.2,
  },
  [Filter.SEAGREEN]: {
    r: 0,
    g: 68,
    b: 62,
    a: 0.2,
  },
  [Filter.FLAGBLUE]: {
    r: 0,
    g: 0,
    b: 131,
    a: 0.2,
  },
  [Filter.DIAMANTE]: {
    r: 30,
    g: 82,
    b: 87,
    a: 0.1,
  },
  [Filter.LIQUID]: {
    r: 0,
    g: 10,
    b: 75,
    a: 0.2,
  },
  [Filter.VINTAGE]: {
    r: 120,
    g: 70,
    b: 13,
    a: 0.2,
  },
  [Filter.PERFUME]: {
    r: 80,
    g: 40,
    b: 120,
    a: 0.2,
  },
  [Filter.SERENITY]: {
    r: 10,
    g: 40,
    b: 90,
    a: 0.2,
  },
};
