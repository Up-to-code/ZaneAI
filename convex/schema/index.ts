import { agentTables } from "./agent";
import { knowledgeTables } from "./knowledge";
import { organizationTables } from "./organizations";
import { profileTables } from "./profile";
import { propertyTables } from "./properties";
import { usageTables } from "./usage";

export const appTables = {
  ...profileTables,
  ...organizationTables,
  ...propertyTables,
  ...agentTables,
  ...knowledgeTables,
  ...usageTables,
};
