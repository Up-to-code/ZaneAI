import { agentTables } from "./agent";
import { knowledgeTables } from "./knowledge";
import { organizationTables } from "./organizations";
import { profileTables } from "./profile";
import { propertyTables } from "./properties";
import { usageTables } from "./usage";
import { workspacePropertyTables } from "./workspaceProperties";
import { workspaceUnitTables } from "./workspaceUnits";

export const appTables = {
  ...profileTables,
  ...organizationTables,
  ...propertyTables,
  ...workspacePropertyTables,
  ...workspaceUnitTables,
  ...agentTables,
  ...knowledgeTables,
  ...usageTables,
};
