import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <BrandLogo />
        <nav className="flex items-center gap-5 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Catalog
          </Link>
          <Link href="/about" className="hover:text-slate-900 transition-colors">
            Manifesto
          </Link>
          <Link href="/blog" className="hover:text-slate-900 transition-colors">
            Guides
          </Link>
        </nav>
      </div>
    </header>
  );
}
