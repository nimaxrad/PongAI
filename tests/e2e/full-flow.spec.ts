import { expect, test } from "@playwright/test";

type PlayerSide = "player" | "opponent";

interface E2ETestApi {
  forceWin(winner: PlayerSide): void;
  snapshot(): {
    phase: string;
    playerScore: number;
    opponentScore: number;
    selectedSkinId: string;
    winner: PlayerSide | null;
  };
}

declare global {
  interface Window {
    __skinnedPongE2E__?: E2ETestApi;
  }
}

test("player can start, win, replay, and switch skins through the full flow", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Skinned Pong" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Skins" }).click();
  const plasmaSkin = page.getByRole("button", { name: "Plasma Pop" });
  await plasmaSkin.click();
  await expect(plasmaSkin).toHaveAttribute("aria-pressed", "true");
  await expect
    .poll(() =>
      page.evaluate(() => localStorage.getItem("skinned-pong:selected-skin")),
    )
    .toBe("plasma-pop");

  await page.getByRole("button", { name: "Start Match" }).click();
  await expect(page.locator("#player-score")).toHaveText("0");
  await expect(page.locator("#opponent-score")).toHaveText("0");

  await page.evaluate(() => window.__skinnedPongE2E__?.forceWin("player"));
  await expect(page.getByRole("heading", { name: "Player Wins" })).toBeVisible();
  await expect(page.locator("#match-final-score")).toHaveText("7 : 0");

  await page.getByRole("button", { name: "Replay" }).click();
  await expect(page.locator("#player-score")).toHaveText("0");
  await expect(page.locator("#opponent-score")).toHaveText("0");
  await expect
    .poll(() => page.evaluate(() => window.__skinnedPongE2E__?.snapshot().phase))
    .toBe("running");

  await page.evaluate(() => window.__skinnedPongE2E__?.forceWin("opponent"));
  await expect(page.getByRole("heading", { name: "AI Wins" })).toBeVisible();
  await page.getByRole("button", { name: "Change Skin" }).click();

  const laserSkin = page.getByRole("button", { name: "Laser Sunset" });
  await laserSkin.click();
  await expect(laserSkin).toHaveAttribute("aria-pressed", "true");
  await expect
    .poll(() =>
      page.evaluate(() => localStorage.getItem("skinned-pong:selected-skin")),
    )
    .toBe("laser-sunset");

  await page.getByRole("button", { name: "Back" }).click();
  await expect(page.getByRole("heading", { name: "AI Wins" })).toBeVisible();

  await page.getByRole("button", { name: "Change Skin" }).click();
  await page.getByRole("button", { name: "Start Match" }).click();
  await expect
    .poll(() =>
      page.evaluate(() => window.__skinnedPongE2E__?.snapshot().selectedSkinId),
    )
    .toBe("laser-sunset");
  await expect(page.locator("#player-score")).toHaveText("0");
  await expect(page.locator("#opponent-score")).toHaveText("0");
});
