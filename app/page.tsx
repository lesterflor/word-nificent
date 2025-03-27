import { getRawWords } from '@/actions/word-actions';
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

	const words = await getRawWords(getRandomLetter());

	const shuffled = shuffle([...(words.data ?? [])]);

	const wordList = (shuffled as GetRawWord[]) ?? [];

	return (
		<div className='flex flex-col gap-6'>
			<StatsHud />

			<div className='flex flex-col gap-4'>
				<CarouselWords words={wordList} />
			</div>
		</div>
	);
}
