'use client';

import {
	ISpendRevealContext,
	SpendRevealContext
} from '@/contexts/spend-reveal-context';
import { useState } from 'react';

export default function SpendRevealProvider({
	children
}: {
	children: React.ReactNode;
}) {
	const [value, setValue] = useState<ISpendRevealContext>({
		amount: 0,
		updated: (value: ISpendRevealContext) => setValue(value)
	});

	return (
		<SpendRevealContext.Provider value={value}>
			{children}
		</SpendRevealContext.Provider>
	);
}
