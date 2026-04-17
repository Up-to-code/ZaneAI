import { agentTables } from "./agent";
import { buyerTables } from "./buyer";
import { knowledgeTables } from "./knowledge";
import { organizationTables } from "./organizations";
import { profileTables } from "./profile";
import { realEstateTables } from "./realEstate";
import { usageTables } from "./usage";

export const appTables = {
  ...profileTables,
  ...organizationTables,
  ...realEstateTables,
  ...buyerTables,
  ...agentTables,
  ...knowledgeTables,
  ...usageTables,
};
