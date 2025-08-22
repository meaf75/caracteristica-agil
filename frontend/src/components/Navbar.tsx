"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

export default function Navbar() {
    const navRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Logo con bounce
            gsap.from(".logo", {
                y: -30,
                opacity: 0,
                duration: 0.8,
                ease: "bounce.out",
            });

            // Items menu
            gsap.fromTo(".nav-item",
                { y: -50, opacity: 0 },   // start
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "power3.out", delay: 0.2 } // end
            );

        }, navRef);

        return () => ctx.revert();
    }, []);

    return (
        <nav
            ref={navRef}
            className="bg-white shadow-md px-6 py-4 flex justify-between items-center"
        >
            <Link href="/" className="logo text-xl font-extrabold text-blue-600">
                MortgageApp
            </Link>
            <div className="flex gap-6">
                <Link
                    href="/evaluate"
                    className="nav-item relative group text-gray-700 hover:text-blue-600 transition"
                >
                    Evaluate
                    <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-600 transition-all group-hover:w-full"></span>
                </Link>
                <Link
                    href="/evaluations"
                    className="nav-item relative group text-gray-700 hover:text-blue-600 transition"
                >
                    Evaluations
                    <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-600 transition-all group-hover:w-full"></span>
                </Link>
            </div>
        </nav>
    );
}
