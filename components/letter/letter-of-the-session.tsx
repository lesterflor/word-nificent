'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { TiSortAlphabeticallyOutline } from 'react-icons/ti';

export default function LetterOfTheSession({
	letter,
	wordMin,
	wordMax
}: {
	letter: string;
	wordMin: number;
	wordMax: number;
}) {
	const [animate, setAnimate] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			setAnimate(true);
		}, 1000);
	}, []);

	return (
		<div className='text-center w-full flex flex-row items-center justify-center gap-1 text-sm'>
			<div className='pr-2'>
				<TiSortAlphabeticallyOutline className='w-8 h-8 text-muted-foreground' />
			</div>

			<div>
				{wordMin} to {wordMax} letter
			</div>
			<div>words that start with</div>
			<div
				className={cn(
					'flex flex-col items-center justify-center w-10 h-10 font-bold capitalize text-2xl p-2 rounded-full border-2 transition-all opacity-0',
					animate && 'opacity-100 animate-[spin_1s_ease-in-out_1]'
				)}>
				{letter}
			</div>
		</div>
	);
}
