import assert from "node:assert/strict";
import test from "node:test";

import { recommendProperties, type SmartPropertySearchArgs } from "./recommendation";
import type { PropertyCompat } from "./catalog";

function property(overrides: Partial<PropertyCompat>): PropertyCompat {
  return {
    _id: "listing" as PropertyCompat["_id"],
    _creationTime: Date.now(),
    externalId: "listing",
    title: "Apartment",
    description: "Comfortable furnished apartment",
    price: 5000,
    priceLabel: "EGP 5,000",
    location: "Giza",
    beds: 2,
    baths: 1,
    area: 100,
    heroUrl: "https://example.com/home.jpg",
    matchScore: 0,
    matchReasons: ["Good fit"],
    aiSummary: "Good fit near the requested area.",
    tags: ["furnished"],
    searchText: "apartment giza furnished",
    ...overrides,
  };
}

function search(args: SmartPropertySearchArgs) {
  return recommendProperties([
    property({
      externalId: "exact",
      title: "Giza apartment",
      location: "Giza",
      price: 4800,
      searchText: "giza apartment furnished",
    }),
    property({
      externalId: "nearby",
      title: "Sheikh Zayed apartment",
      location: "Sheikh Zayed",
      price: 5000,
      searchText: "sheikh zayed apartment furnished",
    }),
    property({
      externalId: "expensive",
      title: "Giza premium apartment",
      location: "Giza",
      price: 7500,
      searchText: "giza apartment premium",
    }),
  ], args);
}

test("ranks exact location before nearby fallback", () => {
  const result = search({ query: "apartment near Giza", location: "Giza", maxPrice: 5500, budgetMode: "max" });

  assert.equal(result.results[0]?.externalId, "exact");
  assert.equal(result.results[0]?.relaxationStage, "exact");
});

test("uses nearby fallback when exact area misses budget", () => {
  const result = recommendProperties([
    property({ externalId: "expensive", location: "Giza", price: 9000 }),
    property({ externalId: "nearby", location: "Sheikh Zayed", price: 5000 }),
  ], {
    query: "around 5000 near Grand Egyptian Museum",
    location: "Grand Egyptian Museum",
    targetPrice: 5000,
    budgetMode: "target",
  });

  assert.equal(result.results[0]?.externalId, "nearby");
  assert.ok(result.relaxedConstraints.length > 0);
});

test("respects max budget unless relaxed fallback is needed", () => {
  const result = search({ query: "max 5000 apartment in Giza", location: "Giza", maxPrice: 5000, budgetMode: "max" });

  assert.equal(result.results[0]?.externalId, "exact");
  assert.ok(result.results.every((row) => row.price <= 5000 || row.relaxationStage !== "exact"));
});
