'use client';

import { AddWordContext, IAddWordContext } from '@/contexts/add-word-context';
import { useState } from 'react';

export default function AddWordProvider({
	children
}: {
	children: React.ReactNode;
}) {
	const [newWord, setWord] = useState<IAddWordContext>({
		word: '',
		updated: (value: IAddWordContext) => setWord(value)
	});

	return (
		<AddWordContext.Provider value={newWord}>
			{children}
		</AddWordContext.Provider>
	);
}
