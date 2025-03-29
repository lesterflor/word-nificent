'use server';

import { auth, signIn, signOut } from '@/db/auth';
import prisma from '@/db/prisma';
import { formatError } from '@/lib/utils';
import { signInFormSchema, signUpFormSchema } from '@/lib/validators';
import { GetUser, GetUserScore } from '@/types';
import { hashSync } from 'bcrypt-ts-edge';
import { isRedirectError } from 'next/dist/client/components/redirect-error';

// sign in with Github
export async function signInGitHub() {
	return signIn('github');
}

// sign in with Google
export async function signInGoogle() {
	return signIn('google');
}

// sign in the user with credentials
export async function signInWithCredentials(
	prevState: unknown,
	formData: FormData
) {
	try {
		const user = signInFormSchema.parse({
			email: formData.get('email'),
			password: formData.get('password')
		});

		await signIn('credentials', user);

		return {
			success: true,
			message: 'Signed In Successfully'
		};
	} catch (err: unknown) {
		if (isRedirectError(err)) {
			throw err;
		}

		return {
			success: false,
			message: 'Invalid credentials'
		};
	}
}

// sign out user
export async function signOutUser() {
	console.log('signing out');
	await signOut({ redirect: true, redirectTo: '/' });
}

// sign up user
export async function signUpUser(prevState: unknown, formData: FormData) {
	try {
		const user = signUpFormSchema.parse({
			name: formData.get('name'),
			email: formData.get('email'),
			password: formData.get('password'),
			confirmPassword: formData.get('confirmPassword')
		});

		const unHashedPassword = user.password;

		user.password = hashSync(user.password, 10);

		await prisma.user.create({
			data: {
				name: user.name,
				email: user.email,
				password: user.password
			}
		});

		await signIn('credentials', {
			email: user.email,
			password: unHashedPassword
		});

		return {
			success: true,
			message: 'Successfully created user'
		};
	} catch (err: unknown) {
		if (isRedirectError(err)) {
			throw err;
		}

		return {
			success: false,
			message: formatError(err)
		};
	}
}

export async function getUserById(userId: string) {
	const user = await prisma.user.findFirst({
		where: {
			id: userId
		},
		include: {
			wordsSolved: true
		}
	});

	if (!user) {
		throw new Error('User not found');
	}

	return user;
}

export async function getPublicUserById(userId: string) {
	const user = await prisma.user.findFirst({
		where: {
			id: userId
		},
		select: {
			id: true,
			name: true,
			email: true,
			image: true,
			createdAt: true,
			role: true
		}
	});

	return user;
}

// update the user profile
export async function updateProfileAction(user: {
	name: string;
	email: string;
	image?: string;
}) {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			throw new Error('User is not authenticated');
		}

		const currentUser = await prisma.user.findFirst({
			where: {
				id: session?.user?.id
			}
		});

		if (!currentUser) {
			throw new Error('User was not found');
		}

		await prisma.user.update({
			where: {
				id: currentUser.id
			},
			data: {
				name: user.name,
				image: user.image
			}
		});

		return {
			success: true,
			message: 'User updated successfully'
		};
	} catch (error: unknown) {
		return {
			success: false,
			message: formatError(error)
		};
	}
}

export async function createUserScore() {
	try {
		const session = await auth();
		const user = session?.user as GetUser;

		if (!session || !user) {
			throw new Error('User must be authenticated');
		}

		const newScore = await prisma.userScore.create({
			data: {
				score: 0,
				userId: user.id
			}
		});

		if (!newScore) {
			throw new Error('There was a problem creating a new user score');
		}

		return {
			success: true,
			message: 'success create user score',
			data: newScore
		};
	} catch (error: unknown) {
		return {
			success: false,
			message: formatError(error)
		};
	}
}

export async function updateUserScore(newScore: number) {
	try {
		const session = await auth();
		const user = session?.user as GetUser;

		if (!session || !user) {
			throw new Error('User must be authenticated');
		}

		let score;

		const existingScore = await prisma.userScore.findFirst({
			where: {
				userId: user.id
			}
		});

		if (!existingScore) {
			const newScore = await createUserScore();

			if (newScore.success && newScore.data) {
				score = newScore.data;
			}
		} else {
			score = existingScore;
		}

		if (!score) {
			throw new Error('There was a problem fetching or creating user score');
		}

		const update = await prisma.userScore.update({
			where: {
				id: score.id
			},
			data: {
				score: newScore
			}
		});

		if (!update) {
			throw new Error('There was a problem updating the user score');
		}

		return {
			success: true,
			message: 'score update success',
			data: update
		};
	} catch (error: unknown) {
		return {
			success: false,
			message: formatError(error)
		};
	}
}

export async function getCurrentUserScore() {
	try {
		const session = await auth();
		const user = session?.user as GetUser;

		if (!session || !user) {
			throw new Error('User must be authenticated');
		}

		let retScore;

		const existing = await prisma.userScore.findFirst({
			where: {
				userId: user.id
			}
		});

		if (!existing) {
			const newScore = await createUserScore();

			if (newScore.success && newScore.data) {
				retScore = newScore;
			}
		} else {
			retScore = existing;
		}

		if (!retScore) {
			throw new Error('There was a problem getting user score');
		}

		//console.log('SCORE: ', retScore);

		return {
			success: true,
			message: 'success getting user score',
			data: retScore
		};
	} catch (error: unknown) {
		return {
			success: false,
			message: formatError(error)
		};
	}
}

export async function getCurrentUserReveals() {
	try {
		const session = await auth();
		const user = session?.user as GetUser;

		if (!session || !user) {
			throw new Error('User must be authenticated');
		}

		let retReveal;

		const existing = await prisma.userReveals.findFirst({
			where: {
				userId: user.id
			},
			include: {
				user: {
					select: {
						userScore: true
					}
				}
			}
		});

		if (!existing) {
			const newScore = await createUserReveals();

			if (newScore.success && newScore.data) {
				retReveal = newScore;
			}
		} else {
			retReveal = existing;
		}

		if (!retReveal) {
			throw new Error('There was a problem getting user reveals');
		}

		//console.log('REVEALS: ', retReveal);

		return {
			success: true,
			message: 'success getting user score',
			data: retReveal
		};
	} catch (error: unknown) {
		return {
			success: false,
			message: formatError(error)
		};
	}
}

export async function createUserReveals() {
	try {
		const session = await auth();
		const user = session?.user as GetUser;

		if (!session || !user) {
			throw new Error('User must be authenticated');
		}

		const newScore = await prisma.userReveals.create({
			data: {
				balance: 0,
				userId: user.id
			},
			include: {
				user: {
					select: {
						userScore: true
					}
				}
			}
		});

		if (!newScore) {
			throw new Error('There was a problem creating a new user reveal');
		}

		return {
			success: true,
			message: 'success create user reveal',
			data: newScore
		};
	} catch (error: unknown) {
		return {
			success: false,
			message: formatError(error)
		};
	}
}

export async function buyUserReveals(amt: number) {
	try {
		const session = await auth();
		const user = session?.user as GetUser;

		if (!session || !user) {
			throw new Error('User must be authenticated');
		}

		let retReveals;

		const existingReveal = await prisma.userReveals.findFirst({
			where: {
				userId: user.id
			}
		});

		if (!existingReveal) {
			const newScore = await createUserReveals();

			if (newScore.success && newScore.data) {
				retReveals = newScore.data;
			}
		} else {
			retReveals = existingReveal;
		}

		if (!retReveals) {
			throw new Error('There was a problem fetching or creating user reveals');
		}

		// before updating, check user's score as balance to buy reveals
		const userScore = await getCurrentUserScore();

		if (!userScore || !userScore.data) {
			throw new Error('There was a problem getting user score');
		}

		const { score: balance, id } = userScore.data as GetUserScore;

		// if the user is requesting over balance return message
		if (amt > balance) {
			return {
				success: true,
				message: 'The amount requested exceeds your score balance'
			};
		}

		// update user's score balance
		const updateScore = await prisma.userScore.update({
			where: {
				id
			},
			data: {
				score: balance - amt
			}
		});

		if (!updateScore) {
			throw new Error('There was a problem updating user score');
		}

		// now update reveals
		const updateReveals = await prisma.userReveals.update({
			where: {
				id: retReveals.id
			},
			data: {
				balance: retReveals.balance + amt
			}
		});

		if (!updateReveals) {
			throw new Error('There was a problem updating the user reveals');
		}

		return {
			success: true,
			message: 'reveal update success',
			data: updateReveals
		};
	} catch (error: unknown) {
		return {
			success: false,
			message: formatError(error)
		};
	}
}

export async function updateUserReveals(amt: number) {
	try {
		const session = await auth();
		const user = session?.user as GetUser;

		if (!session || !user) {
			throw new Error('User must be authenticated');
		}

		let retReveals;

		const existingReveal = await prisma.userReveals.findFirst({
			where: {
				userId: user.id
			}
		});

		if (!existingReveal) {
			const newSReveal = await createUserReveals();

			if (newSReveal.success && newSReveal.data) {
				retReveals = newSReveal.data;
			}
		} else {
			retReveals = existingReveal;
		}

		if (!retReveals) {
			throw new Error('There was a problem fetching or creating user reveals');
		}

		// now update reveals
		const updateReveals = await prisma.userReveals.update({
			where: {
				id: retReveals.id
			},
			data: {
				balance: retReveals.balance - amt
			}
		});

		if (!updateReveals) {
			throw new Error('There was a problem updating the user reveals');
		}

		return {
			success: true,
			message: `You successfull spent ${amt} ${
				amt === 1 ? 'reveal' : 'reveals'
			}`,
			data: updateReveals
		};
	} catch (error: unknown) {
		return {
			success: false,
			message: formatError(error)
		};
	}
}
