'use client';

import { ApiWordDefinition, GetRawWord, GetWord } from '@/types';
import { Card, CardContent, CardHeader } from '../ui/card';
import WordRevealer from './word-revealer';
import AlphabetSelector from './alphabet-selector';
import { useContext, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { GiOwl, GiSquirrel } from 'react-icons/gi';
import { ScrollArea } from '../ui/scroll-area';
import {
	getRawWordDefinition,
	updateUserSolvedWord
} from '@/actions/word-actions';
import ProcessRawWordDefinition from './process-raw-word-definition';
import { toast } from 'sonner';
import { WinContext } from '@/contexts/win-context';
import { useInView } from 'react-intersection-observer';

export default function WordCard({
	word,
	gameMode = false
}: {
	word: GetWord | GetRawWord;
	gameMode?: boolean;
}) {
	const [won, setWon] = useState(-1);
	const [wordDef, setWordDef] = useState<ApiWordDefinition>();
	const [guessesToWin, setGuessesToWin] = useState(0);

	const [renderable, setRenderable] = useState(false);
	const [fade, setFade] = useState(false);
	const [isImmutable, setIsImmutable] = useState(false);
	const [ref, inView] = useInView();

	useEffect(() => {
		if (inView) {
			setRenderable(true);

			setTimeout(() => {
				setFade(true);
			}, 500);
		}
	}, [inView]);

	const divRef = useRef<HTMLDivElement>(null);
	const winContext = useContext(WinContext);

	const addSolvedWordToUser = async () => {
		const res = await updateUserSolvedWord(word.id);

		if (res.success) {
			toast('You are amazing!');
		}
	};

	useEffect(() => {
		if (isImmutable) {
			return;
		}

		if (won === 1 && divRef.current) {
			getWordDefinition();
			addSolvedWordToUser();

			setTimeout(() => {
				if (divRef.current) {
					divRef.current.style.opacity = '1';
				}
			}, 500);

			if (winContext?.updated) {
				const update = {
					...winContext,
					word,
					guesses: guessesToWin
				};

				winContext.updated(update);
			}

			setIsImmutable(true);
		}
	}, [won]);

	useEffect(() => {}, []);

	const getWordDefinition = async () => {
		const res = await getRawWordDefinition(word);

		if (res.success && res.data) {
			setWordDef(res.data);
		}
	};

	return (
		<>
			<div ref={ref}></div>
			{renderable ? (
				<Card
					className={cn(
						'p-2 py-4 w-full transition-opacity opacity-0',
						fade && 'opacity-100 duration-700'
					)}>
					<CardHeader className='text-3xl px-0 pb-0 relative w-full'>
						{!gameMode ? (
							word.name
						) : (
							<>
								<WordRevealer
									guesses={Math.floor(word.name.length - 1)}
									word={word.name}
									onOverGuess={() => {
										setWon(0);
									}}
									onUnderGuess={(guesses) => {
										setGuessesToWin(guesses);
										setWon(1);
									}}
								/>
							</>
						)}
						<div className='text-xs text-muted-foreground absolute -top-6 hidden'>
							{word.name}
						</div>
					</CardHeader>
					<CardContent className='flex flex-col gap-0 px-2 items-center justify-center  relative min-h-48 overflow-hidden w-full'>
						{!gameMode && (
							<div className='flex flex-col gap-3 items-start'>
								{word.definitions &&
									word.definitions.map((def) => (
										<div
											key={def.id}
											className='flex flex-col gap-0'>
											<div className='text-muted-foreground text-xs'>
												{def.type}
											</div>
											<div className='text-sm'>{def.description}</div>
										</div>
									))}
							</div>
						)}

						<div
							className={cn(
								'absolute bottom-0 transition-all duration-500 ease-in-out',
								won === 0 && '-bottom-96',
								won === 1 && '-bottom-96'
							)}>
							<AlphabetSelector word={word.name} />
						</div>
						<div
							className={cn(
								'absolute flex flex-col gap-4 items-center justify-center text-2xl font-bold -top-96 transition-all duration-500 w-full ease-in-out',
								won === 0 && 'top-5'
							)}>
							<div className='flex flex-row items-center gap-2'>
								<GiSquirrel className='w-12 h-12 animate-bounce' />
								<div>Try again later</div>
							</div>
							<div className='text-sm font-normal px-4'>
								We&apos;ll save this word for you later to solve at another
								time.
							</div>
						</div>

						<div
							className={cn(
								'absolute flex flex-col gap-4 items-center justify-center text-2xl font-bold -top-96  transition-all duration-500 w-full ease-in-out',
								won === 1 && 'top-3'
							)}>
							<div className='flex flex-row items-center gap-2 animate-bounce'>
								<GiOwl className='w-12 h-12' />
								<div>You solved it!</div>
							</div>
							<ScrollArea className='w-full h-28'>
								<div
									ref={divRef}
									className='flex flex-col gap-3 items-stretch px-4 font-normal w-full'>
									{word.definitions && word.definitions.length > 0 ? (
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
			) : (
				<></>
			)}
		</>
	);
}
