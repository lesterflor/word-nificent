'use client';

import { getCurrentUserScore, updateUserScore } from '@/actions/user-actions';
import { BuyRevealContext } from '@/contexts/buy-reveal-context';
import { WinContext } from '@/contexts/win-context';
import { GetUserScore } from '@/types';
import { useContext, useEffect, useState } from 'react';

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
		<div className='flex flex-row items-center gap-2'>
			<div>Score</div>
			<div>{userScore > 0 ? userScore : ''}</div>
		</div>
	);
}
