'use client';

import { LetterWordContext } from '@/contexts/letter-word-context';
import { cn, findLettersInWord } from '@/lib/utils';
import { LiaCookieBiteSolid } from 'react-icons/lia';
import { useContext, useEffect, useState } from 'react';
import LetterTile from '../letter/letter-tile';

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
	const [remainingLetters, setRemainingLetters] = useState(word);
	const letterWordContext = useContext(LetterWordContext);

	useEffect(() => {
		setLetters(word.split(''));
	}, [word]);

	useEffect(() => {
		if (letterWordContext?.data) {
			const { word: cWord, letter: cLetter } = letterWordContext.data;

			if (cWord === word) {
				const update = [...revealedLetters];
				setCurrenLetter(cLetter);
				update.push(cLetter);
				setRevealedLetters(update);

				const { updatedWord } = findLettersInWord(remainingLetters, cLetter);
				setRemainingLetters(updatedWord);
			}
		}
	}, [letterWordContext]);

	useEffect(() => {
		setHasSolved(remainingLetters.length === 0);
	}, [remainingLetters]);

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
		<div className='flex flex-col gap-6 items-center justify-center'>
			<div className='flex flex-row items-center gap-1'>
				{letters.length > 0 &&
					letters.map((letter, indx) => (
						<LetterTile
							key={`${letter}-${indx}`}
							letter={letter}
							word={word}
						/>
					))}
			</div>
			<div className='text-xs flex flex-row items-center gap-4 relative'>
				{Array.from({ length: guesses }).map((_v, indx) => (
					<div
						key={indx}
						className={cn(
							'transition-opacity opacity-100',
							guessArr.includes(indx + 1) && 'opacity-0'
						)}>
						<LiaCookieBiteSolid className='w-4 h-4 opacity-60' />
					</div>
				))}
			</div>
		</div>
	);
}
