export interface RecentWordChange {
  id: number;
  word: string;
  language: string;
  part_of_speech?: string;
  last_modified?: string;
}

export interface InconsistentDefinitionReportRow {
  w_id: number;
  w1: string;
  w2: string;
  [key: string]: string | number | null | undefined;
}

export interface ConvergentTranslationReportRow {
  en_definition_id: number;
  fr_definition_id: number;
  suggested_definition: string;
  [key: string]: string | number | null | undefined;
}
