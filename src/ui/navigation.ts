export type ScreenId = "start" | "skins" | "match" | "match-end";
type SkinReturnScreenId = Exclude<ScreenId, "skins">;

export interface ScreenNavigation {
  current(): ScreenId;
  showStart(): void;
  showSkins(returnTo?: SkinReturnScreenId): void;
  showMatch(): void;
  showMatchEnd(): void;
  returnFromSkins(): void;
}

export interface ScreenNavigationOptions {
  startScreen: HTMLElement;
  skinScreen: HTMLElement;
  matchEndScreen: HTMLElement;
  scoreHud: HTMLElement;
}

export function createScreenNavigation({
  startScreen,
  skinScreen,
  matchEndScreen,
  scoreHud,
}: ScreenNavigationOptions): ScreenNavigation {
  let currentScreen: ScreenId = "start";
  let skinReturnScreen: SkinReturnScreenId = "start";

  function showStart(): void {
    currentScreen = "start";
    startScreen.hidden = false;
    skinScreen.hidden = true;
    matchEndScreen.hidden = true;
    scoreHud.hidden = true;
  }

  function showSkins(returnTo?: SkinReturnScreenId): void {
    skinReturnScreen =
      returnTo ?? (currentScreen === "skins" ? skinReturnScreen : currentScreen);
    currentScreen = "skins";
    startScreen.hidden = true;
    skinScreen.hidden = false;
    matchEndScreen.hidden = true;
    scoreHud.hidden = true;
  }

  function showMatch(): void {
    currentScreen = "match";
    startScreen.hidden = true;
    skinScreen.hidden = true;
    matchEndScreen.hidden = true;
    scoreHud.hidden = false;
  }

  function showMatchEnd(): void {
    currentScreen = "match-end";
    startScreen.hidden = true;
    skinScreen.hidden = true;
    matchEndScreen.hidden = false;
    scoreHud.hidden = false;
  }

  function returnFromSkins(): void {
    switch (skinReturnScreen) {
      case "match":
        showMatch();
        break;
      case "match-end":
        showMatchEnd();
        break;
      case "start":
      default:
        showStart();
        break;
    }
  }

  return {
    current: () => currentScreen,
    showStart,
    showSkins,
    showMatch,
    showMatchEnd,
    returnFromSkins,
  };
}
