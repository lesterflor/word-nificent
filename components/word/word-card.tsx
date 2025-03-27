'use client';

import { ApiWordDefinition, GetRawWord, GetWord } from '@/types';
import { Card, CardContent, CardHeader } from '../ui/card';
import WordRevealer from './word-revealer';
import AlphabetSelector from './alphabet-selector';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { GiOwl, GiSquirrel } from 'react-icons/gi';
import { ScrollArea } from '../ui/scroll-area';
import { addRawWordDefinition } from '@/actions/word-actions';
import ProcessRawWordDefinition from './process-raw-word-definition';

export default function WordCard({
	word,
	gameMode = false
}: {
	word: GetWord | GetRawWord;
	gameMode?: boolean;
}) {
	const [won, setWon] = useState(-1);
	const [wordDef, setWordDef] = useState<ApiWordDefinition>();

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

	useEffect(() => {
		getWordDefinition();
	}, []);

	const getWordDefinition = async () => {
		const res = await addRawWordDefinition(word);

		if (res.success && res.data) {
			setWordDef(res.data);
		}
	};

	return (
		<Card className='p-2 py-4 w-full'>
			<CardHeader className='text-3xl px-2 pb-0 relative w-full'>
				{!gameMode ? (
					word.name
				) : (
					<>
						<WordRevealer
							guesses={Math.floor(word.name.length)}
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
				<div className='text-xs text-muted-foreground absolute -top-6'>
					{word.name}
				</div>
			</CardHeader>
			<CardContent className='flex flex-col gap-0 px-2 items-center justify-center  relative min-h-48 overflow-hidden w-full'>
				{!gameMode && (
					<div className='flex flex-col gap-3 items-start'>
						{word.definitions.map((def) => (
							<div
								key={def.id}
								className='flex flex-col gap-0'>
								<div className='text-muted-foreground text-xs'>{def.type}</div>
								<div className='text-sm'>{def.description}</div>
							</div>
						))}
					</div>
				)}

				<div
					className={cn(
						'absolute bottom-0 transition-all duration-1000',
						won === 0 && '-bottom-96',
						won === 1 && '-bottom-96'
					)}>
					<AlphabetSelector word={word.name} />
				</div>
				<div
					className={cn(
						'absolute flex flex-col gap-4 items-center justify-center text-2xl font-bold -top-96 transition-all duration-1000 w-full',
						won === 0 && 'top-5'
					)}>
					<div className='flex flex-row items-center gap-2'>
						<GiSquirrel className='w-12 h-12' />
						<div>Try again later</div>
					</div>
					<div className='text-sm font-normal px-4'>
						We&apos;ll save this word for you later to solve at another time.
					</div>
				</div>

				<div
					className={cn(
						'absolute flex flex-col gap-4 items-center justify-center text-2xl font-bold -top-96  transition-all duration-1000 w-full',
						won === 1 && '-top-0'
					)}>
					<div className='flex flex-row items-center gap-2'>
						<GiOwl className='w-12 h-12' />
						<div>You solved it!</div>
					</div>
					<ScrollArea className='w-full h-36'>
						<div
							ref={divRef}
							className='flex flex-col gap-3 items-stretch px-4 font-normal w-full'>
							{word.definitions.length > 0 ? (
								word.definitions.map((def) => (
									<div
										key={def.id}
										className='flex flex-col gap-0'>
										<div className='text-muted-foreground text-xs'>
											{def.type}
										</div>
										<div className='text-sm'>{def.description}</div>
									</div>
								))
							) : (
								<>
									{wordDef && (
										<ProcessRawWordDefinition
											word={word.name}
											data={wordDef}
										/>
									)}
								</>
							)}
						</div>
					</ScrollArea>
				</div>
			</CardContent>
		</Card>
	);
}
