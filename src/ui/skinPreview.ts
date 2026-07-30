import type { Skin } from "../game/types";

const PREVIEW_WIDTH = 260;
const PREVIEW_HEIGHT = 132;

export function renderSkinPreview(canvas: HTMLCanvasElement, skin: Skin): void {
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("2D canvas rendering is not supported for skin previews.");
  }

  const pixelRatio = window.devicePixelRatio || 1;
  canvas.width = PREVIEW_WIDTH * pixelRatio;
  canvas.height = PREVIEW_HEIGHT * pixelRatio;
  canvas.style.width = "100%";
  canvas.style.aspectRatio = `${PREVIEW_WIDTH} / ${PREVIEW_HEIGHT}`;

  context.save();
  context.scale(pixelRatio, pixelRatio);
  context.clearRect(0, 0, PREVIEW_WIDTH, PREVIEW_HEIGHT);
  context.fillStyle = "#03040a";
  context.fillRect(0, 0, PREVIEW_WIDTH, PREVIEW_HEIGHT);

  drawFieldLine(context, skin);
  drawTrail(context, skin);
  drawPaddle(context, skin);
  drawBall(context, skin);

  context.restore();
}

function drawFieldLine(context: CanvasRenderingContext2D, skin: Skin): void {
  context.save();
  context.strokeStyle = skin.accentColor;
  context.shadowColor = skin.accentColor;
  context.shadowBlur = 10;
  context.lineWidth = 2;
  context.strokeRect(12, 12, PREVIEW_WIDTH - 24, PREVIEW_HEIGHT - 24);
  context.restore();
}

function drawPaddle(context: CanvasRenderingContext2D, skin: Skin): void {
  context.save();
  context.shadowColor = skin.paddleGlowColor;
  context.shadowBlur = 20;
  context.strokeStyle = skin.paddleColor;
  context.lineWidth = 5;
  context.strokeRect(46, 38, 16, 56);
  context.fillStyle = skin.paddleColor;
  context.fillRect(46, 38, 16, 56);
  context.restore();
}

function drawTrail(context: CanvasRenderingContext2D, skin: Skin): void {
  context.save();
  context.globalCompositeOperation = "lighter";

  for (let index = 0; index < 5; index += 1) {
    const life = 1 - index / 5;
    context.globalAlpha = life * 0.22;
    context.shadowColor = skin.trailColor;
    context.shadowBlur = life * 14;
    context.fillStyle = skin.trailColor;
    context.beginPath();
    context.arc(176 - index * 20, 66, 10 + life * 8, 0, Math.PI * 2);
    context.fill();
  }

  context.restore();
}

function drawBall(context: CanvasRenderingContext2D, skin: Skin): void {
  context.save();
  context.shadowColor = skin.ballGlowColor;
  context.shadowBlur = 24;
  context.fillStyle = skin.ballColor;
  context.beginPath();
  context.arc(180, 66, 15, 0, Math.PI * 2);
  context.fill();

  context.shadowBlur = 0;
  context.fillStyle = skin.ballCoreColor;
  context.beginPath();
  context.arc(180, 66, 6, 0, Math.PI * 2);
  context.fill();
  context.restore();
}
