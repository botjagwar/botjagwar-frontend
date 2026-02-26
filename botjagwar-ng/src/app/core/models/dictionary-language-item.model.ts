export interface DictionaryLanguageItem {
  language: string;
  entries?: number;
}

export type DictionaryLanguageListItem = string | DictionaryLanguageItem;

/**
 * Normalizes `/dict/list` responses that can be either language codes or objects.
 */
export function normalizeDictionaryLanguageItem(
  item: DictionaryLanguageListItem
): DictionaryLanguageItem {
  return typeof item === 'string' ? { language: item } : item;
}
