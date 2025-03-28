'use client';

import { GetRawWord, GetUser } from '@/types';
import { useSession } from 'next-auth/react';
//import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { getUserById } from '@/actions/user-actions';
import { useContext, useEffect, useState } from 'react';
import { WinContext } from '@/contexts/win-context';
import UserScore from './user-score';
import UserReveals from './user-reveals';
import { Skeleton } from '../ui/skeleton';

export default function StatsHud() {
	const { data: session } = useSession();
	const user = session?.user as GetUser;
	const [solvedWords, setSolvedWords] = useState<GetRawWord[]>();
	const [isFetching, setIsFetching] = useState(true);

	const winContext = useContext(WinContext);

	useEffect(() => {
		if (winContext && winContext.word) {
			getUserInfo();
		}
	}, [winContext]);

	const getUserInfo = async () => {
		setIsFetching(true);
		const res = await getUserById(user.id);

		if (res.wordsSolved) {
			setSolvedWords(res.wordsSolved);
		}

		setIsFetching(false);
	};

	useEffect(() => {
		getUserInfo();
	}, []);

	return (
		<div className='flex flex-row justify-between items-center gap-2 pt-2'>
			{/* <div className='flex flex-row items-center gap-2 w-fit'>
				<Avatar>
					<AvatarImage src={user.image} />
					<AvatarFallback>{user.name.slice(0, 1)}</AvatarFallback>
				</Avatar>
				<div className='text-muted-foreground'>Hi, {user.name}</div>
			</div> */}

			<div className='flex flex-row gap-2'>
				<UserScore />
				<UserReveals />
			</div>

			<div className='text-xs text-muted-foreground'>
				{isFetching ? (
					<Skeleton className='w-36 h-3' />
				) : (
					<>
						You have solved {solvedWords?.length}{' '}
						{solvedWords?.length === 1 ? 'word' : 'words'}
					</>
				)}
			</div>
		</div>
	);
}
