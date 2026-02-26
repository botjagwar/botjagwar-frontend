import { Definition } from '../models/definition.model';
import { Word } from '../models/word.model';

export function isKnownLanguageCode(
  code: string,
  languageMapping: Partial<Record<string, string>>
): boolean {
  return Boolean(code) && Boolean(languageMapping[code]);
}

export function normalizeDefinitionsForSave(definitions: Definition[]): Definition[] {
  return definitions.map((definition) => ({
    ...definition,
    definition_language: definition.definition_language ?? definition.language
  }));
}

export function normalizeWordForSave(word: Word): Word {
  return {
    ...word,
    definitions: normalizeDefinitionsForSave(word.definitions)
  };
}

export function removeDefinitionFromWord(word: Word, definitionToRemove: Definition): Word {
  return {
    ...word,
    definitions: word.definitions.filter((definition) => definition !== definitionToRemove)
  };
}
