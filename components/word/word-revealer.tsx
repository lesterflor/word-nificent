'use client';

import { LetterWordContext } from '@/contexts/letter-word-context';
import { checkAnagram, cn } from '@/lib/utils';
import { Puzzle } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';

export default function WordRevealer({
	word,
	guesses = 3,
	onOverGuess,
	onUnderGuess
}: {
	word: string;
	guesses?: number;
	onOverGuess: () => void;
	onUnderGuess: (guesses: number) => void;
}) {
	const [letters, setLetters] = useState<string[]>([]);
	const [revealedLetters, setRevealedLetters] = useState<string[]>([]);
	const [numGuesses, setNumGuesses] = useState(0);
	const [guessArr, setGuessArr] = useState<number[]>([]);
	const [hasSolved, setHasSolved] = useState(false);
	const [currentLetter, setCurrenLetter] = useState('');
	const letterWordContext = useContext(LetterWordContext);

	useEffect(() => {
		setLetters(word.split(''));
	}, [word]);

	useEffect(() => {
		if (letterWordContext?.data) {
			const { word: cWord, letter: cLetter } = letterWordContext.data;
			const update = [...revealedLetters];

			if (cWord === word) {
				setCurrenLetter(cLetter);
				update.push(cLetter);
				setRevealedLetters(update);
			}
		}
	}, [letterWordContext]);

	useEffect(() => {
		setTimeout(() => {
			setHasSolved(checkAnagram(word, revealedLetters.join('')));
		}, 1000);
	}, [revealedLetters]);

	useEffect(() => {
		if (currentLetter) {
			if (!letters.includes(currentLetter)) {
				setNumGuesses(numGuesses + 1);
			}
		}
	}, [currentLetter]);

	useEffect(() => {
		const update = [...guessArr];
		update.push(numGuesses);
		setGuessArr(update);

		if (numGuesses > guesses) {
			onOverGuess();
		}
	}, [numGuesses]);

	useEffect(() => {
		if (hasSolved) {
			onUnderGuess(numGuesses);
		}
	}, [hasSolved]);

	return (
		<div className='flex flex-col gap-6 items-center'>
			<div className='flex flex-row items-center gap-4'>
				{letters.length > 0 &&
					letters.map((letter, indx) => (
						<div
							key={`${letter}-${indx}`}
							className={cn(
								'tile',
								revealedLetters.includes(letter) && 'is-flipped'
							)}>
							<div className='tile__face tile__face--back rounded-md border-2 w-12 h-12 flex flex-row items-center justify-center gradient-tile'>
								<div
									className={cn(
										'text-2xl font-bold capitalize opacity-100 drop-shadow-lg'
									)}>
									{letter}
								</div>
							</div>

							<div className='tile__face tile__face--front'>
								<Puzzle className='w-6 h-6' />
							</div>
						</div>
					))}
			</div>
			<div className='text-xs flex flex-row items-center gap-4'>
				{Array.from({ length: guesses }).map((_v, indx) => (
					<div
						key={indx}
						className={cn(
							'rounded-full border-2 w-4 h-4',
							guessArr.includes(indx + 1) && 'bg-red-900'
						)}></div>
				))}
			</div>
		</div>
	);
}
