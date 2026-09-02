import { test } from "node:test";
import assert from "node:assert/strict";
import { durabilityColor, durabilityTierLabel } from "./durability";

test("durabilityColor maps high scores to rich emerald hues", () => {
  assert.equal(durabilityColor(4.9), "#1e6b45");
  assert.equal(durabilityColor(4.5), "#2a7d53");
  assert.equal(durabilityColor(4.1), "#8a6325");
  assert.equal(durabilityColor(3.6), "#a66826");
  assert.equal(durabilityColor(0), "#c9d1d9");
});

test("durabilityTierLabel returns appropriate generational labels", () => {
  assert.match(durabilityTierLabel(4.9), /Generational Heirloom/);
  assert.match(durabilityTierLabel(4.5), /Decade Workhorse/);
  assert.match(durabilityTierLabel(4.1), /High Endurance/);
});
