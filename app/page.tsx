import { getfilterWordList } from '@/actions/word-actions';
import LetterOfTheSession from '@/components/letter/letter-of-the-session';
import PromoDialog from '@/components/promotion/promo-dialog';
import StatsHud from '@/components/stats/stats-hud';

import CarouselWords from '@/components/word/carousel-words';
import { auth } from '@/db/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
	const session = await auth();

	if (!session) {
		redirect('/sign-in');
	}

	const list = await getfilterWordList('', 3, 8);

	return (
		<div className='flex flex-col gap-1'>
			<StatsHud />
			<LetterOfTheSession
				letter={list.currentLetter}
				wordMin={3}
				wordMax={8}
			/>

			<div className='flex flex-col gap-2'>
				<CarouselWords words={list.wordList} />
			</div>
			<PromoDialog />
		</div>
	);
}
