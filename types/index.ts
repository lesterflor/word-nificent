import {
	definitionSchema,
	getDefinitionSchema,
	getRawWordSchema,
	getUserSchema,
	getWordSchema,
	rawWordSchema,
	userSchema,
	wordSchema
} from '@/lib/validators';
import { z } from 'zod';

export type User = z.infer<typeof userSchema>;
export type GetUser = z.infer<typeof getUserSchema>;

export type Word = z.infer<typeof wordSchema>;
export type GetWord = z.infer<typeof getWordSchema>;

export type RawWord = z.infer<typeof rawWordSchema>;
export type GetRawWord = z.infer<typeof getRawWordSchema>;

export type WordDefinition = z.infer<typeof definitionSchema>;
export type GetWordDefinition = z.infer<typeof getDefinitionSchema>;

export type DictionaryAPIDefinitionType = {
	definition: string;
	synonyms: string[];
	antonyms: string[];
	example: string;
};

export type DictionaryAPIMeaningType = {
	partOfSpeech: string;
	definitions: DictionaryAPIDefinitionType[];
	synonyms: string[];
	antonyms: string[];
};

export type WordDictionaryAPIType = {
	word: string;
	phonetics: string[];
	meanings: DictionaryAPIMeaningType[];
	license: {
		name: string;
		url: string;
	};
	sourceUrls: string[];
};

export type ApiWordDefinition = {
	definitions: {
		type: string;
		definition: string;
	}[];
};
