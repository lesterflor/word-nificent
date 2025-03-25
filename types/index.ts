import {
	definitionSchema,
	getDefinitionSchema,
	getUserSchema,
	getWordSchema,
	userSchema,
	wordSchema
} from '@/lib/validators';
import { z } from 'zod';

export type User = z.infer<typeof userSchema>;
export type GetUser = z.infer<typeof getUserSchema>;

export type Word = z.infer<typeof wordSchema>;
export type GetWord = z.infer<typeof getWordSchema>;

export type WordDefinition = z.infer<typeof definitionSchema>;
export type GetWordDefinition = z.infer<typeof getDefinitionSchema>;
