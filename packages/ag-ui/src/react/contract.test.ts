import { expectTypeOf, describe, it } from "vitest";
import type { AgUiConversationTurn } from "../protocol";
import type { ZaneAiProUiTurn } from "../../../../apps/web/server/contracts/zaneAiPro";

describe("AG UI contract", () => {
  it("keeps ZaneAiProUiTurn assignable to the package conversation turn", () => {
    expectTypeOf<ZaneAiProUiTurn>().toMatchTypeOf<AgUiConversationTurn>();
  });
});
