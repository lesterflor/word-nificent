'use client';

import { createContext } from 'react';

export interface IAddWordContext {
	word: string;
	updated?: (update: IAddWordContext) => void;
}

export const AddWordContext = createContext<IAddWordContext | null>(null);
