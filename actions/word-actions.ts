'use server';

import prisma from '@/db/prisma';
import { formatError, getRandomLetter, shuffle } from '@/lib/utils';
import {
	GetRawWord,
	GetUser,
	GetWord,
	Word,
	WordDefinition,
	WordDictionaryAPIType
} from '@/types';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import { auth } from '@/db/auth';

export async function addWord(word: Word, definitions: WordDefinition[]) {
	try {
		const newWord = await prisma.word.create({
			data: word
		});

		if (!newWord) {
			throw new Error('There was a problem creating the word');
		}

		// loop through definitions and create them
		definitions.forEach(async (def) => {
			const newDef = await prisma.definition.create({
				data: {
					description: def.description,
					type: def.type,
					wordId: newWord.id
				}
			});

			if (!newDef) {
				throw new Error('There was a problem adding definition');
			}
		});

		revalidatePath('/');

		return {
			success: true,
			message: 'Word added successfully'
		};
	} catch (error: unknown) {
		return {
			success: true,
			message: formatError(error)
		};
	}
}

export async function getWords() {
	try {
		const words = await prisma.word.findMany({
			orderBy: {
				name: 'asc'
			},
			include: {
				definitions: true
			},
			take: 20
		});

		if (!words) {
			throw new Error('There was a problem fetching words');
		}

		return {
			success: true,
			message: 'success',
			data: words
		};
	} catch (error: unknown) {
		return {
			success: true,
			message: formatError(error)
		};
	}
}

export async function getRawWords(
	letter: string = '',
	minLen: number = 3,
	maxLen: number = 11 // set to 11 for UI purposes
) {
	try {
		const session = await auth();

		if (!session) {
			throw new Error('User must be authenticated');
		}

		const user = session.user as GetUser;

		const existingUser = await prisma.user.findFirst({
			where: { id: user.id },
			include: {
				wordsSolved: true
			}
		});

		if (!existingUser) {
			throw new Error('User was not found');
		}

		const exlcudedIds = existingUser.wordsSolved.map((item) => item.id);

		const words = await prisma.rawWord.findMany({
			where: {
				name: letter ? { startsWith: letter, mode: 'insensitive' } : undefined,
				id: {
					notIn: exlcudedIds
				}
			},
			orderBy: {
				name: 'asc'
			},
			include: {
				definitions: true
			},
			take: 500
		});

		if (!words) {
			throw new Error('There was a problem fetching words');
		}

		const filtered = words.filter(
			(word) =>
				word.name !== '' &&
				word.name.length < maxLen &&
				word.name.length > minLen
		);

		return {
			success: true,
			message: 'success',
			data: filtered
		};
	} catch (error: unknown) {
		return {
			success: true,
			message: formatError(error)
		};
	}
}

export async function getRawWordDefinition(word: GetRawWord | GetWord) {
	try {
		const { name } = word;

		const def = await fetch(
			`https://api.dictionaryapi.dev/api/v2/entries/en/${name}`
		);

		const json = await def.json();

		let payload;

		if (json?.title && json.title === 'No Definitions Found') {
			payload = {
				definitions: []
			};
		} else {
			const data: WordDictionaryAPIType[] = json;
			const [first] = data;
			payload = {
				definitions: first.meanings.map((item) => ({
					type: item.partOfSpeech,
					definition: item.definitions[0].definition
				}))
			};
		}

		return {
			success: true,
			message: 'success?',
			data: payload
		};
	} catch (error: unknown) {
		return {
			success: true,
			message: formatError(error)
		};
	}
}

export async function processTxtFile() {
	try {
		// Asynchronously
		// let lines;
		// await fs.readFile(
		// 	'../wordlist-20210729.txt',
		// 	'utf-8',
		// 	function (err, text) {
		// 		if (err) throw err;
		// 		lines = text.split('\n');
		// 		console.log(lines);
		// 		// Process lines here
		// 		lines.map((word) => {
		// 			const entry = {
		// 				name: word,
		// 				id: new Date().getTime()
		// 			};
		// 			arrWords.push(entry);
		// 		});
		// 	}
		// );

		// synchronously
		const text = fs.readFileSync('../wordlist-20210729.txt', 'utf-8');
		const lines = text.split('\n');

		return {
			success: true,
			message: 'success',
			data: lines
		};
	} catch (error: unknown) {
		return {
			success: true,
			message: formatError(error)
		};
	}
}

export async function seedList() {
	try {
		const res = await processTxtFile();

		if (!res.data) {
			throw new Error('Problem occurred');
		}

		const cleanWords = res.data.map((word) => {
			const clean = word.replace(/[^a-zA-Z0-9]/g, '');

			return {
				name: clean
			};
		});

		const rawWords = await prisma.rawWord.createMany({
			data: cleanWords
		});

		if (!rawWords) {
			throw new Error('something wrong happened');
		}

		return {
			success: true,
			message: 'success',
			data: rawWords
		};
	} catch (error: unknown) {
		return {
			success: true,
			message: formatError(error)
		};
	}
}

export async function updateUserSolvedWord(rawWordId: string) {
	try {
		const session = await auth();

		if (!session) {
			throw new Error('User must be authenticated');
		}

		const user = session?.user as GetUser;

		const existingWord = await prisma.rawWord.findFirst({
			where: {
				id: rawWordId
			}
		});

		if (!existingWord) {
			throw new Error('The word was not found');
		}

		const update = await prisma.rawWord.update({
			where: {
				id: existingWord.id
			},
			data: {
				userId: user.id
			}
		});

		if (!update) {
			throw new Error('There was a problem updating the word');
		}

		return {
			success: true,
			message: 'success adding word to user'
		};
	} catch (error: unknown) {
		return {
			success: true,
			message: formatError(error)
		};
	}
}

export async function getfilterWordList(
	letter: string = '',
	minLen: number = 3,
	maxLen: number = 11
) {
	const currentLetter = letter ? letter : getRandomLetter();

	const rawWords = await getRawWords(currentLetter, minLen, maxLen);

	const shuffled = shuffle([...(rawWords.data ?? [])]);

	const wordList = (shuffled as GetRawWord[]) ?? [];

	return { wordList, currentLetter };
}
