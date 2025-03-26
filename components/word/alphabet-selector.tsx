'use client';

import { useContext, useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { LetterWordContext } from '@/contexts/letter-word-context';

export default function AlphabetSelector({
	word,
	onSelect
}: {
	word: string;
	onSelect?: (letter: string) => void;
}) {
	const alphabet = 'abcdefghijklmnopqrstuvwxyz';
	const [letters] = useState<string[]>(alphabet.split(''));
	const [usedLetters, setUsedLetters] = useState<string[]>([]);
	const [selected, setSelected] = useState('');
	const letterWordContext = useContext(LetterWordContext);

	useEffect(() => {
		if (selected) {
			onSelect?.(selected);

			if (letterWordContext?.updated) {
				const update = {
					...letterWordContext,
					data: {
						word,
						letter: selected
					}
				};
				letterWordContext.updated(update);
			}
		}
	}, [selected]);

	return (
		<div className='flex flex-row flex-wrap gap-3 items-start justify-center'>
			{letters.map((letter) => (
				<Button
					onClick={(e) => {
						e.preventDefault();

						setSelected(letter);

						const updated = [...usedLetters];
						updated.push(letter);

						setUsedLetters(updated);
					}}
					size='icon'
					key={letter}
					disabled={usedLetters.includes(letter)}
					variant={usedLetters.includes(letter) ? 'default' : 'outline'}
					className='capitalize'>
					{letter}
				</Button>
			))}
		</div>
	);
}
