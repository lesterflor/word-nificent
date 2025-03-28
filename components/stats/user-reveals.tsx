'use client';

import {
	buyUserReveals,
	getCurrentUserReveals,
	updateUserReveals
} from '@/actions/user-actions';
import { WinContext } from '@/contexts/win-context';
import { GetUserBalance } from '@/types';
import { useContext, useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { BuyRevealContext } from '@/contexts/buy-reveal-context';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import NumberIncrementor from '../number-incrementor';
import { Badge } from '../ui/badge';
import { GiSquirrel } from 'react-icons/gi';
import { ArrowLeftRight } from 'lucide-react';
import { ImEyePlus } from 'react-icons/im';
import { SpendRevealContext } from '@/contexts/spend-reveal-context';
import { FaSpinner } from 'react-icons/fa6';

export default function UserReveals() {
	const [userReveals, setUserReveals] = useState(0);
	const [reqReveals, setReqReveals] = useState(0);
	const [userScore, setUserScore] = useState(0);
	const [containerOpen, setContainerOpen] = useState(false);
	const [isFetching, setIsFetching] = useState(true);

	const inputRef = useRef<HTMLInputElement>(null);

	const winContext = useContext(WinContext);
	const buyRevealContext = useContext(BuyRevealContext);
	const spendRevealContext = useContext(SpendRevealContext);

	const getUserReveals = async () => {
		setIsFetching(true);
		const res = await getCurrentUserReveals();

		if (res.success && res.data) {
			const {
				balance,
				user: { userScore: currUserScore = [] }
			} = res.data as GetUserBalance;
			setUserReveals(balance);
			setUserScore(currUserScore[0].score);
		}

		setIsFetching(false);
	};

	const buyReveals = async () => {
		setIsFetching(false);
		const res = await buyUserReveals(reqReveals);

		if (res.success && res.data) {
			setContainerOpen(false);

			const { balance: updatedBalance } = res.data as GetUserBalance;
			setUserReveals(updatedBalance);

			toast(res.message);

			if (buyRevealContext && buyRevealContext.updated) {
				const upd = {
					...buyRevealContext,
					balance: updatedBalance
				};
				buyRevealContext.updated(upd);
			}

			setReqReveals(0);
			if (inputRef.current) {
				inputRef.current.value = '';
			}
		} else {
			toast.error(res.message);
		}

		setIsFetching(false);
	};

	const spendReveals = async (amt: number) => {
		setIsFetching(true);
		const res = await updateUserReveals(amt);

		if (res.success && res.data) {
			const { balance: updatedBalance } = res.data as GetUserBalance;
			setUserReveals(updatedBalance);

			toast(res.message);
		} else {
			toast.error(res.message);
		}

		setIsFetching(false);
	};

	useEffect(() => {
		if (winContext && winContext.word.name) {
			//updateBalance(guessesTowin);
		}
	}, [winContext]);

	useEffect(() => {
		if (containerOpen) {
			getUserReveals();
		}
	}, [containerOpen]);

	useEffect(() => {
		if (spendRevealContext?.amount && spendRevealContext.amount > 0) {
			spendReveals(spendRevealContext.amount);
		}
	}, [spendRevealContext]);

	useEffect(() => {
		getUserReveals();
	}, []);

	useEffect(() => {
		getUserReveals();
	}, [buyRevealContext]);

	return (
		<div className='flex flex-row items-center gap-6'>
			<Popover
				open={containerOpen}
				onOpenChange={setContainerOpen}>
				<PopoverTrigger asChild>
					<Button className='w-14'>
						<ImEyePlus className='w-8 h-8' />
						{isFetching ? (
							<FaSpinner className='w-4 h-2 animate-spin' />
						) : userReveals > 0 ? (
							userReveals
						) : (
							''
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className='flex flex-col gap-2'>
					<Badge
						variant='outline'
						className='p-2'>
						<span className='font-normal'>You can spend up to</span>{' '}
						<span className='text-xl'>{userScore}</span>
						<span className='font-normal'>points</span>
					</Badge>
					<div className='text-xs text-muted-foreground space-y-2'>
						<p>
							You can use your score to buy <b>reveals</b>, which allow you to
							reveal letters in a word to better help you solve the words.
						</p>
						<p>
							To use a reveal, <b>tap</b> an unturned letter tile to reveal the
							letter.
						</p>
						<p>
							If the letter in the tile you reveal is in multiple places in the
							word, they will be revealed too, <b>without any extra cost</b> to
							your reveal balance! <GiSquirrel className='w-4 h-4' />
						</p>
					</div>

					<div className='flex flex-row items-center justify-between gap-6'>
						<NumberIncrementor
							compactMode={true}
							allowDecimalIncrement={false}
							allowLongPress={true}
							minValue={1}
							maxValue={userScore}
							onChange={(value) => {
								setReqReveals(Number(value));
							}}
						/>
						<Button
							size='sm'
							onClick={(e) => {
								e.preventDefault();
								buyReveals();
							}}>
							<ArrowLeftRight className='w-4 h-4' />
							Convert
						</Button>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}
