'use server';

import prisma from '@/db/prisma';
import { formatError } from '@/lib/utils';
import {
	GetRawWord,
	GetWord,
	Word,
	WordDefinition,
	WordDictionaryAPIType
} from '@/types';
import { revalidatePath } from 'next/cache';
import fs from 'fs';

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

export async function getRawWords() {
	try {
		const words = await prisma.rawWord.findMany({
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

		const filtered = words.filter(
			(word) => word.name !== '' && word.name.length < 8
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

export async function addRawWordDefinition(word: GetRawWord | GetWord) {
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
