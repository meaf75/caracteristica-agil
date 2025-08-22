"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".fade-up", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 text-white">
      <h1 className="fade-up text-4xl md:text-5xl font-extrabold mb-6 text-center">
        Mortgage Underwriting Demo
      </h1>
      <p className="fade-up text-lg md:text-xl mb-8 text-center max-w-xl">
        Test a simple underwriting engine built with Go + React (Next.js).
      </p>
      <div className="fade-up flex gap-4">
        <Link
          href="/evaluate"
          className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-gray-200 transition"
        >
          New Evaluation
        </Link>
        <Link
          href="/evaluations"
          className="bg-white text-purple-700 px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-gray-200 transition"
        >
          Past Evaluations
        </Link>
      </div>
    </main>
  );
}
