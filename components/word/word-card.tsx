'use client';

import { GetWord } from '@/types';
import { Card, CardContent, CardHeader } from '../ui/card';
import WordRevealer from './word-revealer';
import AlphabetSelector from './alphabet-selector';
import { useEffect, useRef, useState } from 'react';

export default function WordCard({
	word,
	gameMode = false
}: {
	word: GetWord;
	gameMode?: boolean;
}) {
	const [won, setWon] = useState(-1);

	const divRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (won === 1 && divRef.current) {
			setTimeout(() => {
				if (divRef.current) {
					divRef.current.style.opacity = '1';
				}
			}, 500);
		}
	}, [won]);

	return (
		<Card className='p-2 py-4'>
			<CardHeader className='text-3xl px-2'>
				{!gameMode || won === 1 ? (
					word.name
				) : (
					<>
						<WordRevealer
							guesses={Math.floor(word.name.length / 2)}
							word={word.name}
							onOverGuess={() => {
								setWon(0);
								console.log('you lose');
							}}
							onUnderGuess={() => {
								setWon(1);
								console.log('you win!');
							}}
						/>
					</>
				)}
				<div className='text-xs text-muted-foreground'>{word.name}</div>
			</CardHeader>
			<CardContent className='flex flex-col gap-3 px-2 items-center justify-center'>
				{!gameMode || won === 1 ? (
					<div
						ref={divRef}
						className='flex flex-col gap-3 items-start transition-opacity duration-1000 opacity-0'>
						{word.definitions.map((def) => (
							<div
								key={def.id}
								className='flex flex-col gap-0'>
								<div className='text-muted-foreground text-xs'>{def.type}</div>
								<div className='text-sm'>{def.description}</div>
							</div>
						))}
					</div>
				) : (
					<>
						{won === -1 ? (
							<AlphabetSelector word={word.name} />
						) : won === 0 ? (
							<div className='text-3xl font-bold'>You lose!</div>
						) : (
							<div className='text-3xl font-bold'>You solved it!</div>
						)}
					</>
				)}
			</CardContent>
		</Card>
	);
}
