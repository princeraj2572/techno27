"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { serif } from "@/components/indie";
import CanCondensation from "./CanCondensation";
import styles from "@/app/(functionality)/auth/login/login.module.css";

export default function CanAuthScene({ title, subtitle = "Techno-aiMBiAtion 2027", children }: { title: string; subtitle?: string; children: ReactNode }) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus({ preventScroll: true }); }, [title]);
  return <div className={styles.scene}><div className={styles.artboard}>
    <img className={styles.art} src="/images/login/collage-compact.png" width={1672} height={941} alt="" fetchPriority="high" />
    <CanCondensation />
    <section className={styles.content}>
      <h1 ref={heading} tabIndex={-1} className={serif.className}>{title}</h1>
      <p className={styles.subtitle}>{subtitle}</p>
      {children}
    </section>
  </div></div>;
}
