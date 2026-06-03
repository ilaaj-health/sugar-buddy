"use client";

import { useEffect, useRef, useState } from "react";

type AnimationType = "fadeUp" | "fadeIn" | "fadeLeft" | "fadeRight" | "scaleIn";

interface AnimateProps {
  children: React.ReactNode;
  type?: AnimationType;
  delay?: number;
  className?: string;
}

const animations: Record<AnimationType, { from: string; to: string }> = {
  fadeUp: {
    from: "opacity-0 translate-y-8",
    to: "opacity-100 translate-y-0",
  },
  fadeIn: {
    from: "opacity-0",
    to: "opacity-100",
  },
  fadeLeft: {
    from: "opacity-0 -translate-x-8",
    to: "opacity-100 translate-x-0",
  },
  fadeRight: {
    from: "opacity-0 translate-x-8",
    to: "opacity-100 translate-x-0",
  },
  scaleIn: {
    from: "opacity-0 scale-95",
    to: "opacity-100 scale-100",
  },
};

export function Animate({ children, type = "fadeUp", delay = 0, className = "" }: AnimateProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  const anim = animations[type];

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? anim.to : anim.from} ${className}`}
    >
      {children}
    </div>
  );
}

export function AnimateStagger({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
