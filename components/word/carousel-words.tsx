'use client';

import { GetRawWord } from '@/types';
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel';
import WordCard from './word-card';
import { useEffect, useState } from 'react';
import { type CarouselApi } from '@/components/ui/carousel';
import { Button } from '../ui/button';
import LeaderboardHud from '../leaderboard/leaderboard-hud';
import { ChevronRight } from 'lucide-react';

export default function CarouselWords({ words }: { words: GetRawWord[] }) {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);
	const [count, setCount] = useState(0);

	useEffect(() => {
		if (!api) {
			return;
		}

		setCount(api.scrollSnapList().length);
		setCurrent(api.selectedScrollSnap() + 1);

		api.on('select', () => {
			setCurrent(api.selectedScrollSnap() + 1);
		});
	}, [api]);

	const scrollToNext = () => {
		api?.scrollNext();
	};
	// const scrollToPrevious = () => {
	// 	api?.scrollPrev();
	// };

	return (
		<div className='flex flex-col gap-2'>
			<Carousel
				setApi={setApi}
				opts={{ watchDrag: false }}>
				<CarouselContent>
					{words.map((word) => (
						<CarouselItem
							key={word.id}
							className='my-2'>
							<WordCard
								gameMode={true}
								word={word}
							/>
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
			<div className='text-xs text-muted-foreground whitespace-nowrap w-full text-center'>
				{current} of {count}
			</div>

			<div className='flex flex-row items-center justify-between'>
				<LeaderboardHud />

				<Button
					onClick={() => scrollToNext()}
					className='flex flex-row items-center justify-center'>
					Next <ChevronRight className='w-4 h-4' />
				</Button>
			</div>
		</div>
	);
}
