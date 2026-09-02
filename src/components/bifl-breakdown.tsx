import React from "react";
import { SharpStarRating, SharpSparkle } from "@/components/sharp-star";
import type { BiflRatings } from "@/lib/catalog/types";

export function BiflBreakdown({
  ratings,
  summary,
}: {
  ratings: BiflRatings;
  summary?: string;
}) {
  const metrics = [
    {
      label: "Longevity & Build Quality",
      score: ratings.longevity,
      desc: "Decade-spanning durability under heavy daily use",
    },
    {
      label: "Repairability & Maintenance",
      score: ratings.repairability,
      desc: "User-serviceable mechanical design, zero sealed glue",
    },
    {
      label: "After-Sales & Spare Parts in India",
      score: ratings.service,
      desc: "Nationwide availability of affordable official wear parts",
    },
    {
      label: "Material Purity & Heirloom Ageing",
      score: ratings.material,
      desc: "Solid virgin metallurgy / leather with zero synthetic degradation",
    },
  ];

  return (
    <div className="border border-slate-300 bg-white p-5 sm:p-6 shadow-[4px_4px_0_#cbd5e1] space-y-5">
      {/* Overall Score Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-1.5">
            <SharpSparkle size={15} fill="#f59e0b" />
            <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900">
              BIFL Durability Index
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Evaluated on Indian domestic resilience & serviceability
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 shadow-[2px_2px_0_#e2e8f0]">
          <span className="font-mono text-xs uppercase font-bold text-slate-500">Overall:</span>
          <SharpStarRating rating={ratings.overall} size={15} />
          <span className="font-mono text-xs text-slate-500">/ 5.00</span>
        </div>
      </div>

      {/* 4 Core BIFL Metric Stars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="p-3 border border-slate-200 bg-slate-50 shadow-[2px_2px_0_#f1f5f9] flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-xs text-slate-900">{m.label}</span>
              <SharpStarRating rating={m.score} size={12} />
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">{m.desc}</p>
          </div>
        ))}
      </div>

      {/* Editorial Verdict / Summary */}
      {summary && (
        <div className="border-t border-slate-200 pt-4">
          <p className="font-mono text-[11px] uppercase font-bold text-slate-500 mb-1">
            Why It's Buy It For Life (India):
          </p>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-serif italic">
            "{summary}"
          </p>
        </div>
      )}
    </div>
  );
}
