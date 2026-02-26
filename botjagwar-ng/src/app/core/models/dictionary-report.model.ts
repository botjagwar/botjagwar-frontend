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
  w1_id?: number;
  w2_id?: number;
  w1_pos?: string;
  w1_lang?: string;
  w1_defn?: string;
  d_id?: number;
  d_lang?: string;
  w2_pos?: string;
}

export interface ConvergentTranslationReportRow {
  en_definition_id: number;
  fr_definition_id: number;
  suggested_definition: string;
  word?: string;
  word_id?: number;
  language?: string;
  part_of_speech?: string;
  en_definition?: string;
  fr_definition?: string;
  mg_definition_id?: number;
}
