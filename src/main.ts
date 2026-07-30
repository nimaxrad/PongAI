import "./styles.css";
import { FIELD_SIZE, WINNING_SCORE } from "./game/constants";
import { createKeyboardInput } from "./game/input";
import { createGameLoop } from "./game/loop";
import { createCanvasRenderer } from "./game/render";
import { loadSelectedSkinId, saveSelectedSkinId } from "./game/skinStorage";
import {
  createInitialGameState,
  resetMatchState,
  updateGameState,
} from "./game/state";
import type { GamePhase, PlayerSide } from "./game/types";
import { createMatchEndScreen } from "./ui/matchEnd";
import { createScreenNavigation } from "./ui/navigation";
import { createScoreHud } from "./ui/score";
import { createSkinSelectionScreen } from "./ui/skinSelection";

declare global {
  interface Window {
    __skinnedPongE2E__?: {
      forceWin(winner: PlayerSide): void;
      snapshot(): {
        phase: GamePhase;
        playerScore: number;
        opponentScore: number;
        selectedSkinId: string;
        winner: PlayerSide | null;
      };
    };
  }
}

const canvas = document.querySelector<HTMLCanvasElement>("#game-canvas");
const startScreen = document.querySelector<HTMLElement>("#start-screen");
const skinScreen = document.querySelector<HTMLElement>("#skin-selection-screen");
const matchEndScreenElement = document.querySelector<HTMLElement>(
  "#match-end-screen",
);
const scoreHudElement = document.querySelector<HTMLElement>(".score-hud");
const startMatchButton = document.querySelector<HTMLButtonElement>("#start-match-button");
const openSkinsButton = document.querySelector<HTMLButtonElement>("#open-skins-button");
const skinBackButton = document.querySelector<HTMLButtonElement>("#skin-back-button");
const skinStartMatchButton = document.querySelector<HTMLButtonElement>(
  "#skin-start-match-button",
);
const replayMatchButton = document.querySelector<HTMLButtonElement>(
  "#replay-match-button",
);
const endChangeSkinButton = document.querySelector<HTMLButtonElement>(
  "#end-change-skin-button",
);
const matchResultTitle = document.querySelector<HTMLElement>("#match-result-title");
const matchFinalScore = document.querySelector<HTMLElement>("#match-final-score");
const playerScore = document.querySelector<HTMLElement>("#player-score");
const opponentScore = document.querySelector<HTMLElement>("#opponent-score");
const skinPickerList = document.querySelector<HTMLElement>("#skin-picker-list");

if (!canvas) {
  throw new Error("Game canvas element was not found.");
}

if (
  !startScreen ||
  !skinScreen ||
  !matchEndScreenElement ||
  !scoreHudElement ||
  !startMatchButton ||
  !openSkinsButton ||
  !skinBackButton ||
  !skinStartMatchButton ||
  !replayMatchButton ||
  !endChangeSkinButton ||
  !matchResultTitle ||
  !matchFinalScore
) {
  throw new Error("Screen navigation elements were not found.");
}

if (!playerScore || !opponentScore) {
  throw new Error("Score HUD elements were not found.");
}

if (!skinPickerList) {
  throw new Error("Skin picker list element was not found.");
}

const renderer = createCanvasRenderer(canvas);
const gameState = createInitialGameState(FIELD_SIZE, loadSelectedSkinId());
const keyboard = createKeyboardInput(window);
const scoreHud = createScoreHud({ playerScore, opponentScore });
const matchEndScreen = createMatchEndScreen({
  resultTitle: matchResultTitle,
  finalScore: matchFinalScore,
});
const navigation = createScreenNavigation({
  startScreen,
  skinScreen,
  matchEndScreen: matchEndScreenElement,
  scoreHud: scoreHudElement,
});

createSkinSelectionScreen({
  container: skinPickerList,
  selectedSkinId: gameState.selectedSkinId,
  onSelect: (skinId) => {
    gameState.selectedSkinId = skinId;
    saveSelectedSkinId(skinId);
  },
});

function startMatch(): void {
  resetMatchState(gameState);
  scoreHud.update(gameState);
  navigation.showMatch();
}

function showForcedWin(winner: PlayerSide): void {
  resetMatchState(gameState);
  gameState.score.player = winner === "player" ? WINNING_SCORE : 0;
  gameState.score.opponent = winner === "opponent" ? WINNING_SCORE : 0;
  gameState.phase = "match-over";
  gameState.winner = winner;
  scoreHud.update(gameState);
  matchEndScreen.update(gameState);
  navigation.showMatchEnd();
}

startMatchButton.addEventListener("click", startMatch);
skinStartMatchButton.addEventListener("click", startMatch);
replayMatchButton.addEventListener("click", startMatch);
openSkinsButton.addEventListener("click", () => {
  navigation.showSkins("start");
});
endChangeSkinButton.addEventListener("click", () => {
  navigation.showSkins("match-end");
});
skinBackButton.addEventListener("click", () => {
  navigation.returnFromSkins();
});

if (import.meta.env.DEV) {
  window.__skinnedPongE2E__ = {
    forceWin: showForcedWin,
    snapshot: () => ({
      phase: gameState.phase,
      playerScore: gameState.score.player,
      opponentScore: gameState.score.opponent,
      selectedSkinId: gameState.selectedSkinId,
      winner: gameState.winner,
    }),
  };
}

const gameLoop = createGameLoop({
  update: (step) => {
    const previousPhase: GamePhase = gameState.phase;

    updateGameState(gameState, step, keyboard.state);

    if (
      previousPhase !== "match-over" &&
      gameState.phase === "match-over" &&
      gameState.winner
    ) {
      matchEndScreen.update(gameState);
      navigation.showMatchEnd();
    }
  },
  draw: () => {
    renderer.resize();
    renderer.draw(gameState);
    scoreHud.update(gameState);
  },
});

function resize(): void {
  renderer.resize();
  renderer.draw(gameState);
  scoreHud.update(gameState);
}

window.addEventListener("resize", resize);
navigation.showStart();
resize();
gameLoop.start();
