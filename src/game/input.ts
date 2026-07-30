import type { InputState } from "./types";

const UP_CODES = new Set(["ArrowUp", "KeyW"]);
const DOWN_CODES = new Set(["ArrowDown", "KeyS"]);

export interface KeyboardInput {
  state: InputState;
  dispose(): void;
}

export function createKeyboardInput(target: Window): KeyboardInput {
  const state: InputState = {
    up: false,
    down: false,
  };

  function updateState(event: KeyboardEvent, active: boolean): void {
    if (UP_CODES.has(event.code)) {
      state.up = active;
      event.preventDefault();
    }

    if (DOWN_CODES.has(event.code)) {
      state.down = active;
      event.preventDefault();
    }
  }

  function handleKeyDown(event: KeyboardEvent): void {
    updateState(event, true);
  }

  function handleKeyUp(event: KeyboardEvent): void {
    updateState(event, false);
  }

  function handleBlur(): void {
    state.up = false;
    state.down = false;
  }

  target.addEventListener("keydown", handleKeyDown);
  target.addEventListener("keyup", handleKeyUp);
  target.addEventListener("blur", handleBlur);

  return {
    state,
    dispose: () => {
      target.removeEventListener("keydown", handleKeyDown);
      target.removeEventListener("keyup", handleKeyUp);
      target.removeEventListener("blur", handleBlur);
    },
  };
}
