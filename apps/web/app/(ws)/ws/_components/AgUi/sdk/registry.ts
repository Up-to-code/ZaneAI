import type { ComponentType } from "react";
import AgApprovalFooter from "../AgApprovalFooter";
import AgAreaHeatCard from "../AgAreaHeatCard";
import AgConstraintSummary from "../AgConstraintSummary";
import AgDataList from "../AgDataList";
import AgExecutionResultCard from "../AgExecutionResultCard";
import AgFieldRequestList from "../AgFieldRequestList";
import AgFilterSummary from "../AgFilterSummary";
import AgLatestUpdateCard from "../AgLatestUpdateCard";
import AgMarketInsightCard from "../AgMarketInsightCard";
import AgMissingDataPrompt from "../AgMissingDataPrompt";
import AgOfferPublishDraft from "../AgOfferPublishDraft";
import AgOfferSendDraft from "../AgOfferSendDraft";
import AgPersonRelationCard from "../AgPersonRelationCard";
import AgProjectCreateDraft from "../AgProjectCreateDraft";
import AgProjectUnitSelector from "../AgProjectUnitSelector";
import AgTargetSummary from "../AgTargetSummary";
import AgThreadUpdateCard from "../AgThreadUpdateCard";
import type { AgUiComponentId } from "./types";

function registerComponent<T>(component: T) {
  return component as unknown as ComponentType<Record<string, unknown>>;
}

export const AG_UI_COMPONENT_REGISTRY: Record<
  AgUiComponentId,
  ComponentType<Record<string, unknown>>
> = {
  project_create_draft: registerComponent(AgProjectCreateDraft),
  offer_publish_draft: registerComponent(AgOfferPublishDraft),
  offer_send_draft: registerComponent(AgOfferSendDraft),
  thread_update: registerComponent(AgThreadUpdateCard),
  project_unit_selector: registerComponent(AgProjectUnitSelector),
  person_relation: registerComponent(AgPersonRelationCard),
  approval_footer: registerComponent(AgApprovalFooter),
  execution_result: registerComponent(AgExecutionResultCard),
  field_request_list: registerComponent(AgFieldRequestList),
  latest_update: registerComponent(AgLatestUpdateCard),
  market_insight: registerComponent(AgMarketInsightCard),
  area_heat: registerComponent(AgAreaHeatCard),
  constraint_summary: registerComponent(AgConstraintSummary),
  missing_data_prompt: registerComponent(AgMissingDataPrompt),
  data_list: registerComponent(AgDataList),
  filter_summary: registerComponent(AgFilterSummary),
  target_summary: registerComponent(AgTargetSummary),
};
