import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer mt-auto border-t border-[#e7e0d6] bg-[#f2eee6] text-[#78716c]">
      <div className="mx-auto flex max-w-4xl flex-col items-start justify-between gap-4 px-4 py-8 sm:flex-row sm:items-center sm:px-8">
        <div>
          <p className="font-display text-sm font-semibold text-[#1c1917]">
            bifl.in — Buy It For Life India
          </p>
          <p className="mt-1 text-xs text-[#78716c]">
            Generational, repairable, and heirloom goods built to outlast planned obsolescence.
          </p>
        </div>
        <nav className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#57534e]">
          <Link href="/" className="hover:text-[#1c1917] transition-colors">
            Catalog
          </Link>
          <Link href="/about" className="hover:text-[#1c1917] transition-colors">
            Manifesto
          </Link>
          <Link href="/blog" className="hover:text-[#1c1917] transition-colors">
            Care Guides
          </Link>
          <Link href="/privacy" className="hover:text-[#1c1917] transition-colors">
            Privacy
          </Link>
          <a
            href="https://github.com/krishnanunnir/bifl.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#1c1917] transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
