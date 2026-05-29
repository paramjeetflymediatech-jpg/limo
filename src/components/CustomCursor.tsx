"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    // Hide default cursor on desktop
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) {
      cursor.style.display = "none";
      follower.style.display = "none";
      return;
    }

    document.body.style.cursor = "none";

    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out",
      });

      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("interactive-hover")
      ) {
        gsap.to(cursor, {
          scale: 1.5,
          backgroundColor: "#D0A511",
          duration: 0.2,
        });
        gsap.to(follower, {
          scale: 2.2,
          borderColor: "#D0A511",
          backgroundColor: "rgba(208, 165, 17, 0.1)",
          borderWidth: "1px",
          duration: 0.2,
        });
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("interactive-hover")
      ) {
        gsap.to(cursor, {
          scale: 1,
          backgroundColor: "#ffffff",
          duration: 0.2,
        });
        gsap.to(follower, {
          scale: 1,
          borderColor: "rgba(208, 165, 17, 0.4)",
          backgroundColor: "transparent",
          borderWidth: "1px",
          duration: 0.2,
        });
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);
    window.addEventListener("mouseout", onMouseOut);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("mouseout", onMouseOut);
      document.body.style.cursor = "auto";
    };
  }, []);

  return (
    <>
      {/* Inner dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-9999 -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      />
      {/* Outer glow ring */}
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-8 h-8 border border-[rgba(208,165,17,0.4)] rounded-full pointer-events-none z-9998 -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out"
      />
    </>
  );
}
