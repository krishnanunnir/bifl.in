import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-100 bg-slate-50/50 py-10 text-slate-500 text-xs">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 sm:flex-row sm:items-center sm:px-6">
        <div>
          <p className="font-semibold text-slate-900 text-sm">bifl.in</p>
          <p className="mt-1 text-slate-500">
            Buy It For Life India · Curated generational and repairable goods.
          </p>
        </div>
        <nav className="flex flex-wrap items-center gap-5 font-medium text-slate-600">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Catalog
          </Link>
          <Link href="/about" className="hover:text-slate-900 transition-colors">
            Manifesto
          </Link>
          <Link href="/blog" className="hover:text-slate-900 transition-colors">
            Guides
          </Link>
          <Link href="/privacy" className="hover:text-slate-900 transition-colors">
            Privacy
          </Link>
          <a
            href="https://github.com/krishnanunnir/bifl.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-900 transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
