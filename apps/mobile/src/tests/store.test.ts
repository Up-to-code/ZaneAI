import test from "node:test";
import assert from "node:assert/strict";
import { createStore } from "zustand/vanilla";

import { createPropertySlice, type PropertySlice } from "../store/slices/propertySlice";

function createPropertyTestStore() {
  return createStore<PropertySlice>()((set, get, store) =>
    createPropertySlice(set, get, store),
  );
}

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

test("property slice dismisses properties locally", () => {
  const store = createPropertyTestStore();

  store.getState().dismissProperty("prop-business-bay-02");
  store.getState().dismissProperty("prop-business-bay-02");

  assert.deepEqual(store.getState().dismissedPropertyIds, ["prop-business-bay-02"]);
});
