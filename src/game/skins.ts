import type { Skin } from "./types";

export const SKINS = [
  {
    id: "arcade-voltage",
    label: "Arcade Voltage",
    paddleColor: "#27f5ff",
    paddleGlowColor: "rgba(39, 245, 255, 0.86)",
    ballColor: "#39ff14",
    ballCoreColor: "#f7fff6",
    ballGlowColor: "rgba(57, 255, 20, 0.88)",
    trailColor: "rgba(57, 255, 20, 0.72)",
    accentColor: "#ff3df2",
  },
  {
    id: "plasma-pop",
    label: "Plasma Pop",
    paddleColor: "#ff3df2",
    paddleGlowColor: "rgba(255, 61, 242, 0.84)",
    ballColor: "#27f5ff",
    ballCoreColor: "#f5fdff",
    ballGlowColor: "rgba(39, 245, 255, 0.86)",
    trailColor: "rgba(39, 245, 255, 0.68)",
    accentColor: "#39ff14",
  },
  {
    id: "ion-lime",
    label: "Ion Lime",
    paddleColor: "#39ff14",
    paddleGlowColor: "rgba(57, 255, 20, 0.8)",
    ballColor: "#f8ff4a",
    ballCoreColor: "#fffde8",
    ballGlowColor: "rgba(248, 255, 74, 0.84)",
    trailColor: "rgba(248, 255, 74, 0.7)",
    accentColor: "#27f5ff",
  },
  {
    id: "laser-sunset",
    label: "Laser Sunset",
    paddleColor: "#ff7a18",
    paddleGlowColor: "rgba(255, 122, 24, 0.82)",
    ballColor: "#ff2d75",
    ballCoreColor: "#fff0f6",
    ballGlowColor: "rgba(255, 45, 117, 0.86)",
    trailColor: "rgba(255, 45, 117, 0.68)",
    accentColor: "#27f5ff",
  },
] as const satisfies readonly Skin[];

export type SkinId = (typeof SKINS)[number]["id"];

export const DEFAULT_SKIN_ID: SkinId = SKINS[0].id;

export function isSkinId(value: string): value is SkinId {
  return SKINS.some((skin) => skin.id === value);
}

export function getSkinById(skinId: string): Skin {
  return SKINS.find((skin) => skin.id === skinId) ?? SKINS[0];
}
