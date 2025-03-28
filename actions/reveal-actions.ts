'use server';

import { auth } from '@/db/auth';
import prisma from '@/db/prisma';
import { formatError, getToday } from '@/lib/utils';
import { updateUserReveals } from './user-actions';

export async function createDailyReward() {
	const session = await auth();
	const user = session?.user;

	if (!session || !user) {
		return;
	}

	let isFreshSession;

	// first check if there are any logs for today
	try {
		let logForToday;

		const todaysLog = await prisma.userLog.findFirst({
			where: {
				userId: user.id,
				createdAt: {
					gte: getToday().todayStart,
					lt: getToday().todayEnd
				}
			},
			include: {
				user: {
					select: {
						name: true,
						image: true,
						wordsSolved: true,
						userReveals: true,
						userScore: true
					}
				}
			}
		});

		// there hasn't been a log created for today - create a new one
		if (!todaysLog) {
			const newLog = await prisma.userLog.create({
				data: {
					userId: user.id as string,
					rewards: 20
				},
				include: {
					user: {
						select: {
							name: true,
							image: true,
							wordsSolved: true,
							userReveals: true,
							userScore: true
						}
					}
				}
			});
			isFreshSession = true;
			logForToday = newLog;

			if (!newLog) {
				throw new Error('something wrong happened creating new log');
			}

			// add reveal points to their account
			const addPoints = await updateUserReveals(-Number(newLog.rewards));

			if (addPoints.success) {
				console.log('success adding daily rewards to user');
			}
		} else {
			isFreshSession = false;
			logForToday = todaysLog;
		}

		return {
			success: true,
			message: 'success',
			data: { reward: logForToday, returningUser: !isFreshSession }
		};
	} catch (error: unknown) {
		return {
			success: false,
			message: formatError(error),
			data: null
		};
	}
}
