"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/camera", label: "Camera" },
  { href: "/favorites", label: "Favorites" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      className="border-b border-border bg-background sticky top-0 z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container-app flex flex-col sm:flex-row items-center justify-between py-4 sm:py-0 sm:h-16 gap-4 sm:gap-0">
        {/* Brand */}
        <Link
          href="/"
          className="text-lg font-bold text-foreground tracking-tight transition-default hover:opacity-70"
        >
          CatMood
        </Link>

        {/* Navigation links */}
        <div className="flex flex-wrap justify-center items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  px-3 py-2 text-sm font-medium rounded-[var(--radius-button)] transition-default
                  ${
                    isActive
                      ? "bg-foreground text-background"
                      : "text-secondary hover:text-foreground hover:bg-card"
                  }
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
