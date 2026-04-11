import test from "node:test";
import assert from "node:assert/strict";
import { createStore } from "zustand/vanilla";

import { createPropertySlice, type PropertySlice } from "../store/slices/propertySlice";

function createPropertyTestStore() {
  return createStore<PropertySlice>()((set, get, store) =>
    createPropertySlice(set, get, store),
  );
}

test("property slice toggles saved properties optimistically", () => {
  const store = createPropertyTestStore();

  store.getState().toggleSavedProperty("prop-business-bay-02");
  assert.ok(store.getState().savedPropertyIds.includes("prop-business-bay-02"));

  store.getState().toggleSavedProperty("prop-business-bay-02");
  assert.ok(!store.getState().savedPropertyIds.includes("prop-business-bay-02"));
});

test("property slice limits compare tray to two properties", () => {
  const store = createPropertyTestStore();

  store.getState().toggleCompareProperty("prop-dubai-marina-01");
  store.getState().toggleCompareProperty("prop-business-bay-02");
  store.getState().toggleCompareProperty("prop-palm-03");

  assert.deepEqual(store.getState().comparePropertyIds, [
    "prop-business-bay-02",
    "prop-palm-03",
  ]);
});
