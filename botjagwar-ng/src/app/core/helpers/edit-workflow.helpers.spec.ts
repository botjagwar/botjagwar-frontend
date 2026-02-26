import {
  isKnownLanguageCode,
  normalizeDefinitionsForSave,
  normalizeWordForSave,
  removeDefinitionFromWord
} from './edit-workflow.helpers';

describe('edit-workflow helpers', () => {
  it('validates known language codes from a mapping', () => {
    expect(isKnownLanguageCode('eng', { eng: 'English' })).toBe(true);
    expect(isKnownLanguageCode('xxx', { eng: 'English' })).toBe(false);
    expect(isKnownLanguageCode('', { eng: 'English' })).toBe(false);
  });

  it('maps definition.language to definition_language during save normalization', () => {
    const normalized = normalizeDefinitionsForSave([{ definition: 'cat', language: 'eng' }]);

    expect(normalized[0].definition_language).toBe('eng');
  });

  it('normalizes all definitions inside a word payload', () => {
    const word = {
      id: 1,
      word: 'saka',
      language: 'mg',
      definitions: [
        { id: 10, definition: 'cat', language: 'eng' },
        { id: 11, definition: 'chat', definition_language: 'fra' }
      ]
    };

    const normalized = normalizeWordForSave(word);

    expect(normalized.definitions[0].definition_language).toBe('eng');
    expect(normalized.definitions[1].definition_language).toBe('fra');
  });

  it('removes a definition by object identity for staged deletion', () => {
    const removable = { id: 2, definition: 'to remove', language: 'eng' };
    const word = {
      id: 3,
      word: 'foo',
      language: 'eng',
      definitions: [{ id: 1, definition: 'keep', language: 'eng' }, removable]
    };

    const updated = removeDefinitionFromWord(word, removable);

    expect(updated.definitions).toHaveLength(1);
    expect(updated.definitions[0].id).toBe(1);
  });
});
