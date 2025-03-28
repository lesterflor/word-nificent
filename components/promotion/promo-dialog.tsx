'use client';

import { createDailyReward } from '@/actions/reveal-actions';
import { useContext, useEffect, useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger
} from '../ui/dialog';
import SquirrelSprint from '../squirrel/squirrel-sprint';
import { GiOwl } from 'react-icons/gi';
import { BuyRevealContext } from '@/contexts/buy-reveal-context';

export default function PromoDialog() {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [rewards, setRewards] = useState(0);
	const buyRevealContext = useContext(BuyRevealContext);

	const checkDailySession = async () => {
		const res = await createDailyReward();

		if (res?.success && res.data) {
			const { reward, returningUser } = res.data;

			setRewards(reward.rewards);

			if (!returningUser) {
				setDialogOpen(true);

				if (buyRevealContext && buyRevealContext.updated) {
					const upd = {
						...buyRevealContext,
						balance: buyRevealContext.balance
					};
					buyRevealContext.updated(upd);
				}
			}
		}
	};

	useEffect(() => {
		checkDailySession();
	}, []);

	return (
		<Dialog
			open={dialogOpen}
			onOpenChange={setDialogOpen}>
			<DialogTrigger></DialogTrigger>
			<DialogContent className='overflow-hidden'>
				<DialogTitle>Thanks for logging in today!</DialogTitle>
				<DialogContent className='flex flex-col gap-2 font-normal text-muted-foreground'>
					<div className='text-lg font-bold text-foreground flex flex-row item-center justify-center gap-1'>
						<GiOwl className='w-8 h-8' />
						<div>Thanks for logging in today!</div>
					</div>
					<p>
						For your support, here are{' '}
						<b className='text-2xl text-foreground'>{rewards}</b> reveal points
						added to your reveal balance to start fresh with.
					</p>
					<p>Good luck!</p>
					<SquirrelSprint />
					<br />
				</DialogContent>
			</DialogContent>
		</Dialog>
	);
}
