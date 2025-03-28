'use server';

import { auth } from '@/db/auth';
import prisma from '@/db/prisma';
import { formatError } from '@/lib/utils';

export async function getLeaderboardUsers() {
	try {
		const session = await auth();

		if (!session) {
			throw new Error('User must be authenticated');
		}

		const users = await prisma.user.findMany({
			select: {
				id: true,
				name: true,
				image: true,
				wordsSolved: true
			}
		});

		if (!users) {
			throw new Error('There was a problem getting users');
		}

		return {
			success: true,
			message: 'success get users',
			data: users
		};
	} catch (error: unknown) {
		return {
			success: false,
			message: formatError(error)
		};
	}
}
