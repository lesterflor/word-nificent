'use client';

import { createContext } from 'react';

export interface ISpendRevealContext {
	amount: number;
	updated?: (update: ISpendRevealContext) => void;
}

export const SpendRevealContext = createContext<ISpendRevealContext | null>(
	null
);
