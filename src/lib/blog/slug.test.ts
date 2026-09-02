import { test } from "node:test";
import assert from "node:assert/strict";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

test("slugify generates clean URL slugs for Indian product titles", () => {
  assert.equal(
    slugify("Hawkins Futura Hard Anodized Pressure Cooker"),
    "hawkins-futura-hard-anodized-pressure-cooker"
  );
  assert.equal(
    slugify("P-TAL Handcrafted Pure Brass & Bronze (Kansa) Lagan"),
    "p-tal-handcrafted-pure-brass-bronze-kansa-lagan"
  );
  assert.equal(
    slugify("HMT Janata Devanagari 17-Jewels"),
    "hmt-janata-devanagari-17-jewels"
  );
});
