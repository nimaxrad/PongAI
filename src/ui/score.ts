import type { GameState } from "../game/types";

export interface ScoreHud {
  update(state: GameState): void;
}

export interface ScoreHudElements {
  playerScore: HTMLElement;
  opponentScore: HTMLElement;
}

export function createScoreHud({
  playerScore,
  opponentScore,
}: ScoreHudElements): ScoreHud {
  let lastPlayerScore: number | null = null;
  let lastOpponentScore: number | null = null;

  function update(state: GameState): void {
    if (state.score.player !== lastPlayerScore) {
      playerScore.textContent = String(state.score.player);
      lastPlayerScore = state.score.player;
    }

    if (state.score.opponent !== lastOpponentScore) {
      opponentScore.textContent = String(state.score.opponent);
      lastOpponentScore = state.score.opponent;
    }
  }

  return { update };
}
