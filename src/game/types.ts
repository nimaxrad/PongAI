export interface Size {
  width: number;
  height: number;
}

export interface Vector2 {
  x: number;
  y: number;
}

export interface Paddle {
  position: Vector2;
  size: Size;
}

export interface Ball {
  position: Vector2;
  velocity: Vector2;
  radius: number;
  trail: BallTrailSample[];
}

export interface BallTrailSample {
  position: Vector2;
  ageSeconds: number;
}

export interface InputState {
  up: boolean;
  down: boolean;
}

export interface Skin {
  id: string;
  label: string;
  paddleColor: string;
  paddleGlowColor: string;
  ballColor: string;
  ballCoreColor: string;
  ballGlowColor: string;
  trailColor: string;
  accentColor: string;
}

export type PlayerSide = "player" | "opponent";
export type GamePhase = "title" | "running" | "match-over";

export interface Score {
  player: number;
  opponent: number;
}

export interface GameTiming {
  frame: number;
  elapsedSeconds: number;
  deltaSeconds: number;
}

export interface GameState {
  field: Size;
  phase: GamePhase;
  timing: GameTiming;
  score: Score;
  winner: PlayerSide | null;
  selectedSkinId: string;
  player: Paddle;
  opponent: Paddle;
  ball: Ball;
}

export interface FrameStep {
  deltaSeconds: number;
  timestampSeconds: number;
}
