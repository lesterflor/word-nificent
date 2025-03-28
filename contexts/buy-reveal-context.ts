'use client';

import { createContext } from 'react';

export interface IBuyRevealContext {
	balance: number;
	updated?: (update: IBuyRevealContext) => void;
}

export const BuyRevealContext = createContext<IBuyRevealContext | null>(null);
