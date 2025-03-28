import {
	definitionSchema,
	getDefinitionSchema,
	getRawWordSchema,
	getUserBalanceSchema,
	getUserLogSchema,
	getUserSchema,
	getUserScoreSchema,
	getWordSchema,
	rawWordSchema,
	userBalanceSchema,
	userLogSchema,
	userSchema,
	userScoreSchema,
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

export type UserScore = z.infer<typeof userScoreSchema>;
export type GetUserScore = z.infer<typeof getUserScoreSchema>;

export type UserBalance = z.infer<typeof userBalanceSchema>;
export type GetUserBalance = z.infer<typeof getUserBalanceSchema>;

export type UserLog = z.infer<typeof userLogSchema>;
export type GetUserLog = z.infer<typeof getUserLogSchema>;

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

export type PlayerType = {
	id: string;
	name: string;
	image: string;
	wordsSolved: GetRawWord[];
};
