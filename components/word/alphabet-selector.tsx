'use client';

import { useContext, useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { LetterWordContext } from '@/contexts/letter-word-context';
import { RevealWordLetterContext } from '@/contexts/reveal-word-letter-context';

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

	const revealLetterContext = useContext(RevealWordLetterContext);

	useEffect(() => {
		if (selected) {
			onSelect?.(selected);

			const updated = [...usedLetters];
			updated.push(selected);

			setUsedLetters(updated);

			dispatchLetterContext();
		}
	}, [selected]);

	const dispatchLetterContext = () => {
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
	};

	useEffect(() => {
		if (revealLetterContext?.data.word === word) {
			const { letter: cLetter } = revealLetterContext.data;

			setSelected(cLetter);
		}
	}, [revealLetterContext]);

	return (
		<div className='flex flex-row flex-wrap gap-3 portrait:gap-2 items-start justify-center'>
			{letters.map((letter) => (
				<Button
					onClick={(e) => {
						e.preventDefault();

						setSelected(letter);
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
