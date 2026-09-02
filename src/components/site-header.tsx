import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

export function SiteHeader() {
  return (
    <header className="site-header sticky top-0 z-40 border-b border-[#e7e0d6] bg-[#f8f6f0]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3.5 sm:px-8">
        <BrandLogo />
        <nav className="site-nav flex items-center gap-4 sm:gap-6" aria-label="Main Navigation">
          <Link
            href="/"
            className="text-xs sm:text-sm font-semibold text-[#57534e] hover:text-[#1c1917] transition-colors"
          >
            Catalog
          </Link>
          <Link
            href="/about"
            className="text-xs sm:text-sm font-semibold text-[#57534e] hover:text-[#1c1917] transition-colors"
          >
            Manifesto
          </Link>
          <Link
            href="/blog"
            className="text-xs sm:text-sm font-semibold text-[#57534e] hover:text-[#1c1917] transition-colors"
          >
            Guides & Essays
          </Link>
        </nav>
      </div>
    </header>
  );
}
