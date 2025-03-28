import { getRawWords } from '@/actions/word-actions';
import PromoDialog from '@/components/promotion/promo-dialog';
import StatsHud from '@/components/stats/stats-hud';

import CarouselWords from '@/components/word/carousel-words';
import { auth } from '@/db/auth';
import { getRandomLetter, shuffle } from '@/lib/utils';
import { GetRawWord } from '@/types';
import { redirect } from 'next/navigation';

export default async function Home() {
	const session = await auth();

	if (!session) {
		redirect('/sign-in');
	}

	const currentLetter = getRandomLetter();

	const words = await getRawWords(currentLetter);

	const shuffled = shuffle([...(words.data ?? [])]);

	const wordList = (shuffled as GetRawWord[]) ?? [];

	return (
		<div className='flex flex-col gap-2'>
			<StatsHud />
			<div className='text-center w-full flex flex-row items-center justify-center gap-1'>
				<div>Words that start with</div>
				<div className='flex flex-col items-center justify-center w-12 h-12 font-bold capitalize text-2xl p-2 rounded-full border-2'>
					{currentLetter}
				</div>
			</div>

			<div className='flex flex-col gap-3'>
				<CarouselWords words={wordList} />
			</div>
			<PromoDialog />
		</div>
	);
}
