"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./HangingNazar.module.css";

export default function HangingNazar({ fixed = false }: { fixed?: boolean }) {
  const ornament = useRef<HTMLDivElement>(null);
  const [inactive, setInactive] = useState(false);
  useEffect(() => {
    let visible = true;
    const update = () => setInactive(document.hidden || !visible);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
    observer.observe(ornament.current!);
    document.addEventListener("visibilitychange", update);
    update();
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); };
  }, []);
  return <aside className={styles.position} data-fixed={fixed} aria-hidden="true">
    <div ref={ornament} className={styles.pivot} aria-hidden="true" style={{ animationPlayState: inactive ? "paused" : "running" }}>
      <img src="/images/registration-frame/hanging-nazar.png" width={446} height={669} alt="" />
    </div>
  </aside>;
}
