'use client';

import {
	BuyRevealContext,
	IBuyRevealContext
} from '@/contexts/buy-reveal-context';
import { useState } from 'react';

export default function BuyRevealProvider({
	children
}: {
	children: React.ReactNode;
}) {
	const [balance, setBalance] = useState<IBuyRevealContext>({
		balance: 0,
		updated: (value: IBuyRevealContext) => setBalance(value)
	});

	return (
		<BuyRevealContext.Provider value={balance}>
			{children}
		</BuyRevealContext.Provider>
	);
}
