import {
  BALL_RADIUS,
  FIELD_BORDER_INSET,
  PADDLE_EDGE_OFFSET,
  PADDLE_SIZE,
  PLAYER_PADDLE_SPEED,
  WINNING_SCORE,
} from "./constants";
import { updateOpponentPaddle } from "./ai";
import { createServeVelocity, updateBallPhysics } from "./physics";
import { DEFAULT_SKIN_ID } from "./skins";
import type { SkinId } from "./skins";
import type {
  FrameStep,
  GameState,
  InputState,
  PlayerSide,
  Size,
} from "./types";

export function createInitialGameState(
  field: Size,
  selectedSkinId: SkinId = DEFAULT_SKIN_ID,
): GameState {
  const paddleY = (field.height - PADDLE_SIZE.height) / 2;

  return {
    field: { ...field },
    phase: "title",
    timing: {
      frame: 0,
      elapsedSeconds: 0,
      deltaSeconds: 0,
    },
    score: {
      player: 0,
      opponent: 0,
    },
    winner: null,
    selectedSkinId,
    player: {
      position: {
        x: PADDLE_EDGE_OFFSET,
        y: paddleY,
      },
      size: { ...PADDLE_SIZE },
    },
    opponent: {
      position: {
        x: field.width - PADDLE_EDGE_OFFSET - PADDLE_SIZE.width,
        y: paddleY,
      },
      size: { ...PADDLE_SIZE },
    },
    ball: {
      position: {
        x: field.width / 2,
        y: field.height / 2,
      },
      velocity: createServeVelocity(1),
      radius: BALL_RADIUS,
      trail: [],
    },
  };
}

export function updateGameState(
  state: GameState,
  step: FrameStep,
  input: InputState,
): void {
  state.timing.frame += 1;
  state.timing.deltaSeconds = step.deltaSeconds;
  state.timing.elapsedSeconds += step.deltaSeconds;

  if (state.phase !== "running") {
    return;
  }

  updatePlayerPaddle(state, step.deltaSeconds, input);
  updateOpponentPaddle(state, step.deltaSeconds);
  const pointWinner = updateBallPhysics(state, step.deltaSeconds);

  if (pointWinner) {
    awardPoint(state, pointWinner);
  }
}

export function resetMatchState(state: GameState): void {
  const paddleY = (state.field.height - PADDLE_SIZE.height) / 2;

  state.phase = "running";
  state.timing.frame = 0;
  state.timing.elapsedSeconds = 0;
  state.timing.deltaSeconds = 0;
  state.score.player = 0;
  state.score.opponent = 0;
  state.winner = null;
  state.player.position.x = PADDLE_EDGE_OFFSET;
  state.player.position.y = paddleY;
  state.opponent.position.x =
    state.field.width - PADDLE_EDGE_OFFSET - PADDLE_SIZE.width;
  state.opponent.position.y = paddleY;
  state.ball.position.x = state.field.width / 2;
  state.ball.position.y = state.field.height / 2;
  state.ball.velocity = createServeVelocity(1);
  state.ball.trail = [];
}

function awardPoint(state: GameState, winner: PlayerSide): void {
  state.score[winner] += 1;

  if (state.score[winner] >= WINNING_SCORE) {
    state.phase = "match-over";
    state.winner = winner;
  }
}

function updatePlayerPaddle(
  state: GameState,
  deltaSeconds: number,
  input: InputState,
): void {
  const direction = Number(input.down) - Number(input.up);

  if (direction === 0) {
    return;
  }

  const minY = FIELD_BORDER_INSET;
  const maxY = state.field.height - FIELD_BORDER_INSET - state.player.size.height;
  const nextY =
    state.player.position.y + direction * PLAYER_PADDLE_SPEED * deltaSeconds;

  state.player.position.y = clamp(nextY, minY, maxY);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
