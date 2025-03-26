'use client';

import {
	ILetterWordContext,
	LetterWordContext
} from '@/contexts/letter-word-context';
import { useState } from 'react';

export default function LetterWordProvider({
	children
}: {
	children: React.ReactNode;
}) {
	const [newWord, setWord] = useState<ILetterWordContext>({
		data: { word: '', letter: '' },
		updated: (value: ILetterWordContext) => setWord(value)
	});

	return (
		<LetterWordContext.Provider value={newWord}>
			{children}
		</LetterWordContext.Provider>
	);
}
