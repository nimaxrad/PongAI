import type { GameState } from "../game/types";

export interface MatchEndScreen {
  update(state: GameState): void;
}

export interface MatchEndScreenOptions {
  resultTitle: HTMLElement;
  finalScore: HTMLElement;
}

export function createMatchEndScreen({
  resultTitle,
  finalScore,
}: MatchEndScreenOptions): MatchEndScreen {
  function update(state: GameState): void {
    resultTitle.textContent =
      state.winner === "player" ? "Player Wins" : "AI Wins";
    finalScore.textContent = `${state.score.player} : ${state.score.opponent}`;
  }

  return {
    update,
  };
}
