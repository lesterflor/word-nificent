'use server';

import prisma from '@/db/prisma';
import { formatError } from '@/lib/utils';
import { Word, WordDefinition } from '@/types';
import { revalidatePath } from 'next/cache';

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
			}
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
