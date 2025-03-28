'use client';

import { LetterWordContext } from '@/contexts/letter-word-context';
import { cn, findLettersInWord } from '@/lib/utils';
import { useContext, useEffect, useState } from 'react';
import { FaPuzzlePiece, FaSpinner } from 'react-icons/fa6';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { GiSquirrel } from 'react-icons/gi';
import { RevealWordLetterContext } from '@/contexts/reveal-word-letter-context';
import { SpendRevealContext } from '@/contexts/spend-reveal-context';

export default function LetterTile({
	letter,
	word
}: {
	letter: string;
	word: string;
}) {
	const [revealedLetters, setRevealedLetters] = useState<string[]>([]);
	const letterWordContext = useContext(LetterWordContext);
	const [remainingLetters, setRemainingLetters] = useState(word);
	const [letterPromptOpen, setLetterPromptOpen] = useState(false);
	const [isSpending, setIsSpending] = useState(false);

	const [tileClass, setTileClass] = useState('');
	const [textClass, setTextClass] = useState('');

	const revealLetterContext = useContext(RevealWordLetterContext);
	const spendRevealContext = useContext(SpendRevealContext);

	useEffect(() => {
		switch (true) {
			case word.length === 7:
				setTileClass('w-10 h-10 rounded-md');
				break;
			case word.length === 8:
				setTileClass('w-8 h-8 rounded-md');
				break;
			case word.length >= 9:
				setTileClass('w-7 h-7 rounded-sm');
				break;
			default:
				setTileClass('w-12 h-12 rounded-md');
		}

		switch (true) {
			case word.length === 7:
				setTextClass('text-2xl');
				break;
			case word.length === 8:
				setTextClass('text-xl');
				break;
			case word.length >= 9:
				setTextClass('text-sm');
				break;
			default:
				setTextClass('text-2xl');
		}
	}, [word]);

	useEffect(() => {
		if (letterWordContext?.data) {
			const { word: cWord, letter: cLetter } = letterWordContext.data;

			if (cWord === word) {
				updateRevealedLetters(cLetter);
			}
		}
	}, [letterWordContext]);

	const updateRevealedLetters = (lttr: string) => {
		const update = [...revealedLetters];
		update.push(lttr);
		setRevealedLetters(update);

		const { updatedWord } = findLettersInWord(remainingLetters, lttr);
		setRemainingLetters(updatedWord);
	};

	const sendLetterContext = () => {
		if (revealLetterContext?.updated) {
			const update = {
				...revealLetterContext,
				data: {
					word,
					letter
				}
			};

			revealLetterContext.updated(update);
		}
	};

	const sendSpendRevealContext = () => {
		if (spendRevealContext?.updated) {
			const update = {
				...spendRevealContext,
				amount: 1
			};

			spendRevealContext.updated(update);
		}
	};

	return (
		<div
			className={cn(
				'tile',
				tileClass,
				revealedLetters.includes(letter) && 'is-flipped'
			)}>
			<div
				className={cn(
					'tile__face tile__face--back border-2 flex flex-row items-center justify-center gradient-tile',
					tileClass
				)}>
				<div
					className={cn(
						'font-bold capitalize opacity-100 drop-shadow-lg',
						textClass
					)}>
					{letter}
				</div>
			</div>

			<Popover
				open={letterPromptOpen}
				onOpenChange={setLetterPromptOpen}>
				<PopoverTrigger asChild>
					<div
						className={cn(
							'tile__face tile__face--front',
							letterPromptOpen && 'animate-pulse'
						)}>
						<FaPuzzlePiece className='w-4 h-4 text-muted-foreground' />
					</div>
				</PopoverTrigger>
				<PopoverContent className='flex flex-col gap-2 items-center'>
					<div>Do you want to reveal this letter for a cost of 1 reveal?</div>
					<Button
						disabled={isSpending}
						onClick={(e) => {
							e.preventDefault();
							setIsSpending(true);
							updateRevealedLetters(letter);
							setLetterPromptOpen(false);

							sendLetterContext();
							sendSpendRevealContext();
						}}>
						{isSpending ? (
							<FaSpinner className='w-4 h-4 animate-spin' />
						) : (
							<GiSquirrel className='w-4 h-4' />
						)}
						{isSpending ? 'Revealing!..' : 'Reveal!'}
					</Button>
				</PopoverContent>
			</Popover>
		</div>
	);
}
