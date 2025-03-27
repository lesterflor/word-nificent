'use client';

import { GetRawWord } from '@/types';
import { createContext } from 'react';

export interface IWinContext {
	word: GetRawWord;
	updated?: (update: IWinContext) => void;
}

export const WinContext = createContext<IWinContext | null>(null);
