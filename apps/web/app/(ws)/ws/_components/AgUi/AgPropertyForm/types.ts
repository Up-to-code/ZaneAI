import type { ProjectFormSaveResult } from "../../../(zones)/projects/shared/forms/projectFormSubmission";

export type ProjectFormData = {
  name: string;
  location: string;
  description: string;
  projectType: "villas" | "apartments" | "land_plots" | "mixed" | "custom";
  expectedUnits?: string;
  developerName?: string;
  startingPrice?: string;
  installmentYears?: string;
  compoundAmenities?: string[];
  masterPlanImageKey?: string;
};

export type AgPropertyFormProps = {
  propertyId?: string;
  initialData?: Partial<ProjectFormData>;
  title?: string;
  description?: string;
  submitLabel?: string;
  onSave?: (data: ProjectFormData) => Promise<ProjectFormSaveResult> | ProjectFormSaveResult;
  onCancel?: () => void;
  cancelHref?: string;
  onDelete?: () => void;
};
