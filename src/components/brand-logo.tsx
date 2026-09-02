import Link from "next/link";

export function BrandLogo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2 group text-decoration-none">
      <div className="w-7 h-7 rounded-md bg-slate-900 text-white flex items-center justify-center font-mono font-bold text-xs">
        B
      </div>
      <div className="flex items-baseline font-sans">
        <span className="text-base font-bold text-slate-900 tracking-tight">bifl</span>
        <span className="text-xs font-semibold text-slate-500">.in</span>
      </div>
    </Link>
  );
}
