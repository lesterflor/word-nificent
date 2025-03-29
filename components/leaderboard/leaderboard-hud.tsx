'use client';

import { useContext, useEffect, useState } from 'react';
import { Badge } from '../ui/badge';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetTitle,
	SheetTrigger
} from '../ui/sheet';
import UseAnimations from 'react-useanimations';
import activity from 'react-useanimations/lib/activity';
import { PlayerType } from '@/types';
import { getLeaderboardUsers } from '@/actions/leaderboard-actions';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { WinContext } from '@/contexts/win-context';
import { format } from 'date-fns';

export default function LeaderboardHud() {
	const [players, setPlayers] = useState<PlayerType[]>();
	const [sheetOpen, setSheetOpen] = useState(false);
	const [dateTime, setDateTime] = useState(new Date());

	const winContext = useContext(WinContext);

	useEffect(() => {
		if (winContext?.word) {
			getPlayers();
		}
	}, [winContext]);

	const getPlayers = async () => {
		const res = await getLeaderboardUsers();

		if (res.success && res.data) {
			const sortlist = res.data.sort(
				(a, b) => b.wordsSolved.length - a.wordsSolved.length
			);

			setPlayers(sortlist as PlayerType[]);
		}
	};

	useEffect(() => {
		getPlayers();
	}, []);

	useEffect(() => {
		if (sheetOpen) {
			setDateTime(new Date());
		}
	}, [sheetOpen]);

	return (
		<Sheet
			open={sheetOpen}
			onOpenChange={setSheetOpen}>
			<SheetTrigger asChild>
				<Button className='p-2'>
					<UseAnimations
						animation={activity}
						loop={true}
						autoPlay={true}
					/>{' '}
					Top Scores
				</Button>
			</SheetTrigger>
			<SheetContent
				side='bottom'
				className='p-6'>
				<SheetTitle className='flex flex-row items-center gap-2'>
					<UseAnimations
						strokeColor='white'
						animation={activity}
						loop={true}
						autoPlay={true}
					/>{' '}
					Top Solvers
					<div className='text-xs text-muted-foreground'>
						{format(dateTime, 'ee PP h:mm a')}
					</div>
				</SheetTitle>
				<SheetDescription></SheetDescription>
				<div className='flex flex-col gap-2'>
					{players &&
						players.length > 0 &&
						players.map((item, indx) => (
							<div
								key={item.id}
								className='flex flex-row items-center justify-between border-b-2 py-2'>
								<div className='flex flex-row items-center gap-2'>
									<div>
										<Badge variant='outline'>{indx + 1}</Badge>
									</div>
									<div>
										<Avatar>
											<AvatarImage src={item.image} />
											<AvatarFallback>{item.name.slice(0, 1)}</AvatarFallback>
										</Avatar>
									</div>
									<div className='text-xs text-muted-foreground'>
										{item.name}
									</div>
								</div>

								<div className='text-2xl font-bold'>
									{item.wordsSolved.length}
								</div>
							</div>
						))}
				</div>
			</SheetContent>
		</Sheet>
	);
}
