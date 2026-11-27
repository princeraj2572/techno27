"use client";
import type { CSSProperties } from "react";
import styles from "./CanCondensation.module.css";

const drops = [
  [7, 4, 7, 90, 8, -2], [89, 10, 6, 80, 9, -6], [8, 56, 7, 95, 10, -4],
  [90, 67, 5, 65, 8, -3], [5, 32, 5, 75, 9, -7], [91, 40, 6, 90, 10, -5],
  [15, 0, 6, 40, 9, -4], [81, 1, 7, 45, 11, -8],
  [10, 9, 5, 55, 10, -6], [87, 15, 6, 50, 12, -3],
  [20, 3, 5, 35, 8, -5], [74, 4, 5, 38, 10, -2],
  [12, 21, 7, 65, 11, -9], [85, 26, 8, 70, 9, -4],
  [6, 45, 6, 80, 12, -8], [93, 50, 7, 75, 10, -3],
  [15, 75, 5, 35, 9, -6], [81, 78, 6, 30, 11, -7],
  [4, 2, 4, 35, 10, -1], [10, 14, 5, 42, 9, -5],
  [6, 25, 4, 48, 11, -8], [12, 36, 6, 55, 12, -3],
  [3, 47, 5, 40, 9, -7], [9, 59, 4, 45, 10, -2],
  [5, 70, 6, 32, 11, -6], [11, 82, 4, 25, 12, -9],
  [93, 3, 5, 38, 11, -4], [86, 16, 4, 45, 10, -8],
  [92, 28, 6, 50, 12, -2], [85, 39, 4, 55, 9, -6],
  [94, 51, 5, 42, 10, -3], [88, 62, 6, 38, 11, -7],
  [92, 73, 4, 30, 12, -5], [84, 84, 5, 24, 9, -1],
  [35, 91, 4, 15, 10, -4], [46, 94, 5, 12, 12, -8],
  [57, 90, 4, 18, 11, -2], [68, 95, 5, 10, 9, -6],
];

export default function CanCondensation() {
  return <div className={styles.layer} aria-hidden="true">
      {drops.map(([x, y, size, distance, duration, delay], i) => <i key={i} className={styles.drop} style={{ left: `${x}%`, top: `${y}%`, width: size, height: size * 1.4, "--travel": `calc(var(--scene-height) * ${distance / 900})`, animationDuration: `${duration}s`, animationDelay: `${delay}s` } as CSSProperties} />)}
  </div>;
}
