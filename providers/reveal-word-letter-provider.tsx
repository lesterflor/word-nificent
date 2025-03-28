'use client';

import {
	IRevealWordLetterContext,
	RevealWordLetterContext
} from '@/contexts/reveal-word-letter-context';
import { useState } from 'react';

export default function RevealWordLetterProvider({
	children
}: {
	children: React.ReactNode;
}) {
	const [data, setData] = useState<IRevealWordLetterContext>({
		data: {
			word: '',
			letter: ''
		},
		updated: (value: IRevealWordLetterContext) => setData(value)
	});

	return (
		<RevealWordLetterContext.Provider value={data}>
			{children}
		</RevealWordLetterContext.Provider>
	);
}
