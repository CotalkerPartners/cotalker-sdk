type ProjectSchema = {
  field_currency: string;
  status: string;
  field_owner: string;
  field_asset: string;
  field_region: string;
  field_project_type: string;
  field_manager: string;
  field_sponsor: string;
  field_extendedwbs: boolean;
  field_name: string;
  field_tags: string;
  field_correlative_id: string;
  field_phase: string;
  field_the_stage: string;
  field_cor: string;
  field_unifiernumber?: string;
  isapproved?: boolean;
  field_sap_number?: string;
  field_cers?: string[];
  current_coru?: string;
  field_raes?: string[];
  current_mpr?: string;
  procurement_status?: string;
  schedule_status?: string;
  field_wbs_status?: string;
};

export interface Project extends Omit<COTProperty, 'schemaInstance'> {
  schemaInstance: ProjectSchema;
} 