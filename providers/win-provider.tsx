'use client';

import { IWinContext, WinContext } from '@/contexts/win-context';
import { GetRawWord } from '@/types';
import { useState } from 'react';

export default function WinWordProvider({
	children
}: {
	children: React.ReactNode;
}) {
	const [newWord, setWord] = useState<IWinContext>({
		word: {} as GetRawWord,
		updated: (value: IWinContext) => setWord(value)
	});

	return <WinContext.Provider value={newWord}>{children}</WinContext.Provider>;
}
