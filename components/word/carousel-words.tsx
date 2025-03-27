'use client';

import { GetRawWord } from '@/types';
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel';
import WordCard from './word-card';
import { useEffect, useState } from 'react';
import { type CarouselApi } from '@/components/ui/carousel';
import { Button } from '../ui/button';

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
		<div className='flex flex-col gap-6'>
			<Carousel
				setApi={setApi}
				opts={{ watchDrag: false }}>
				<CarouselContent>
					{words.map((word) => (
						<CarouselItem
							key={word.id}
							className='my-4'>
							<WordCard
								gameMode={true}
								word={word}
							/>
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
			<div className='flex flex-row items-center justify-between'>
				{/* {current > 1 && (
					<Button onClick={() => scrollToPrevious()}>Previous</Button>
				)} */}

				<div>
					{current} of {count}
				</div>
				<Button onClick={() => scrollToNext()}>Next</Button>
			</div>
		</div>
	);
}
