'use client';

import { createContext } from 'react';

export interface IRevealWordLetterContext {
	data: {
		word: string;
		letter: string;
	};
	updated?: (update: IRevealWordLetterContext) => void;
}

export const RevealWordLetterContext =
	createContext<IRevealWordLetterContext | null>(null);
