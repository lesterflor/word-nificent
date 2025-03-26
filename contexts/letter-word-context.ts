'use client';

import { createContext } from 'react';

export interface ILetterWordContext {
	data: { word: string; letter: string };
	updated?: (update: ILetterWordContext) => void;
}

export const LetterWordContext = createContext<ILetterWordContext | null>(null);
