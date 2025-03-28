'use client';

import { getCurrentUserScore, updateUserScore } from '@/actions/user-actions';
import { BuyRevealContext } from '@/contexts/buy-reveal-context';
import { WinContext } from '@/contexts/win-context';
import { GetUserScore } from '@/types';
import { useContext, useEffect, useState } from 'react';
import { MdScore } from 'react-icons/md';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { ImEyePlus } from 'react-icons/im';

export default function UserScore() {
	const [userScore, setUserScore] = useState(0);

	const winContext = useContext(WinContext);
	const buyRevealContext = useContext(BuyRevealContext);

	const getUserScore = async () => {
		const res = await getCurrentUserScore();

		if (res.success && res.data) {
			const { score } = res.data as GetUserScore;
			setUserScore(score);
		}
	};

	const updateScore = async (score: number = 0) => {
		const res = await updateUserScore(userScore + score);

		if (res.success && res.data) {
			const { score: updatedScore } = res.data as GetUserScore;
			setUserScore(updatedScore);
		}
	};

	useEffect(() => {
		if (winContext && winContext.word.name) {
			console.log('update score reached');
			// update score
			const wordLen = winContext.word.name.length;
			const guessesTowin = wordLen - winContext.guesses;

			updateScore(guessesTowin);
		}
	}, [winContext]);

	useEffect(() => {
		if (buyRevealContext) {
			getUserScore();
		}
	}, [buyRevealContext]);

	useEffect(() => {
		getUserScore();
	}, []);

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant='secondary'>
					<MdScore className='w-12 h-12' />
					{userScore > 0 ? userScore : ''}
				</Button>
			</PopoverTrigger>
			<PopoverContent className='flex flex-col gap-2 text-xs text-muted-foreground'>
				<p className='text-lg text-foreground'>
					Your current score is {userScore}
				</p>
				<p>This is your score that you get points for every word you solve.</p>
				<p>
					The score you get per word solved is the word length minus the number
					of tries it took for you to solve the word.
				</p>
				<p>
					You can use your score to convert into{' '}
					<span className='text-foreground text-sm flex flex-row items-center gap-1'>
						reveal points <ImEyePlus className='w-4 h-4' />
					</span>
				</p>
				<p>
					You can use reveal points to reveal letters you may be having a hard
					time to figure out in a word.
				</p>
			</PopoverContent>
		</Popover>
	);
}
