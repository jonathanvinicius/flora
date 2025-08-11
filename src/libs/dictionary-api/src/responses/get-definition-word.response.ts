export type License = {
  name: string;
  url: string;
};

export type Phonetic = {
  text?: string;
  audio?: string;
  sourceUrl?: string;
  license?: License;
};

export type Definition = {
  definition: string;
  example?: string;
  synonyms?: string[];
  antonyms?: string[];
};

export type Meaning = {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms?: string[];
  antonyms?: string[];
};

export interface DictionaryEntry {
  word: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
  license?: License;
  sourceUrls?: string[];
}

export type GetDefinitionWordResponse = DictionaryEntry[];
