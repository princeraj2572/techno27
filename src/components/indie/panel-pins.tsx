"use client";

import { useEffect } from "react";

// Stacked "drawer" sections: each .panel pins once its bottom edge reaches the bottom of the screen,
// so sections taller than the screen (most of them on phones) are fully readable before the next slides over.
export function PanelPins() {
  useEffect(() => {
    const panels = [...document.querySelectorAll<HTMLElement>(".panel")];
    const ro = new ResizeObserver(() => panels.forEach((el) => el.style.setProperty("--panel-h", `${el.offsetHeight}px`)));
    panels.forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, []);
  return null;
}
