import type { FrameStep } from "./types";

export const MAX_DELTA_SECONDS = 1 / 15;

export interface GameLoop {
  start(): void;
  stop(): void;
  isRunning(): boolean;
}

export interface GameLoopOptions {
  update(step: FrameStep): void;
  draw(): void;
}

export function createGameLoop({ update, draw }: GameLoopOptions): GameLoop {
  let animationFrameId: number | null = null;
  let lastTimestampSeconds: number | null = null;
  let running = false;

  function tick(timestampMilliseconds: number): void {
    if (!running) {
      return;
    }

    const timestampSeconds = timestampMilliseconds / 1000;
    const rawDeltaSeconds =
      lastTimestampSeconds === null
        ? 0
        : timestampSeconds - lastTimestampSeconds;
    const deltaSeconds = Math.min(
      Math.max(rawDeltaSeconds, 0),
      MAX_DELTA_SECONDS,
    );

    lastTimestampSeconds = timestampSeconds;

    try {
      update({ deltaSeconds, timestampSeconds });
      draw();
      animationFrameId = window.requestAnimationFrame(tick);
    } catch (error) {
      stop();
      console.error("Game loop stopped after an unrecoverable frame error.", error);
      window.setTimeout(() => {
        throw error;
      }, 0);
    }
  }

  function start(): void {
    if (running) {
      return;
    }

    running = true;
    lastTimestampSeconds = null;
    animationFrameId = window.requestAnimationFrame(tick);
  }

  function stop(): void {
    running = false;
    lastTimestampSeconds = null;

    if (animationFrameId !== null) {
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  return {
    start,
    stop,
    isRunning: () => running,
  };
}
