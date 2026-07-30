import { DEFAULT_SKIN_ID, SKINS } from "../game/skins";
import { renderSkinPreview } from "./skinPreview";

export interface SkinSelectionOptions {
  container: HTMLElement;
  selectedSkinId?: string;
  onSelect?: (skinId: string) => void;
}

export function createSkinSelectionScreen({
  container,
  selectedSkinId = DEFAULT_SKIN_ID,
  onSelect,
}: SkinSelectionOptions): void {
  let selectedId = selectedSkinId;
  const cards: HTMLButtonElement[] = [];

  for (const skin of SKINS) {
    const card = document.createElement("button");
    const preview = document.createElement("canvas");
    const label = document.createElement("span");

    card.type = "button";
    card.className = "skin-card";
    card.dataset.skinId = skin.id;
    card.setAttribute("aria-pressed", String(skin.id === selectedId));

    preview.className = "skin-card__preview";
    label.className = "skin-card__label";
    label.textContent = skin.label;

    card.append(preview, label);
    card.addEventListener("click", () => {
      selectedId = skin.id;
      updateSelection(cards, selectedId);
      onSelect?.(skin.id);
    });

    renderSkinPreview(preview, skin);
    cards.push(card);
  }

  container.replaceChildren(...cards);
  updateSelection(cards, selectedId);
}

function updateSelection(cards: HTMLButtonElement[], selectedId: string): void {
  for (const card of cards) {
    const isSelected = card.dataset.skinId === selectedId;
    card.classList.toggle("skin-card--selected", isSelected);
    card.setAttribute("aria-pressed", String(isSelected));
  }
}
