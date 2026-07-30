import { DEFAULT_SKIN_ID, isSkinId } from "./skins";
import type { SkinId } from "./skins";

const SELECTED_SKIN_STORAGE_KEY = "skinned-pong:selected-skin";

export function loadSelectedSkinId(storage: Storage = window.localStorage): SkinId {
  try {
    const storedSkinId = storage.getItem(SELECTED_SKIN_STORAGE_KEY);

    if (storedSkinId && isSkinId(storedSkinId)) {
      return storedSkinId;
    }
  } catch (error) {
    console.warn("Unable to load selected skin from browser storage.", error);
  }

  return DEFAULT_SKIN_ID;
}

export function saveSelectedSkinId(
  skinId: string,
  storage: Storage = window.localStorage,
): void {
  if (!isSkinId(skinId)) {
    return;
  }

  try {
    storage.setItem(SELECTED_SKIN_STORAGE_KEY, skinId);
  } catch (error) {
    console.warn("Unable to save selected skin to browser storage.", error);
  }
}
