import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// format errors
export function formatError(error: any) {
	if (error.name === 'ZodError') {
		const fieldErrors = Object.keys(error.errors).map(
			(field) => error.errors[field].message
		);

		return fieldErrors.join('. ');
	} else if (
		error.name === 'PrismaClientKnownRequestError' &&
		error.code === 'P2002'
	) {
		const field = error.meta?.target ? error.meta.target[0] : 'Field';

		return `${field[0].toUpperCase() + field.slice(1)} already exists`;
	} else {
		return typeof error.message === 'string'
			? error.message
			: JSON.stringify(error.message);
	}
}

export const formatDateTime = (dateString: Date) => {
	const dateTimeOptions: Intl.DateTimeFormatOptions = {
		month: 'short', // abbreviated month name (e.g., 'Oct')
		year: 'numeric', // abbreviated month name (e.g., 'Oct')
		day: 'numeric', // numeric day of the month (e.g., '25')
		hour: 'numeric', // numeric hour (e.g., '8')
		minute: 'numeric', // numeric minute (e.g., '30')
		hour12: true // use 12-hour clock (true) or 24-hour clock (false)
	};
	const dateOptions: Intl.DateTimeFormatOptions = {
		weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
		month: 'short', // abbreviated month name (e.g., 'Oct')
		year: 'numeric', // numeric year (e.g., '2023')
		day: 'numeric' // numeric day of the month (e.g., '25')
	};
	const dateOptionsNoDay: Intl.DateTimeFormatOptions = {
		month: 'short', // abbreviated month name (e.g., 'Oct')
		year: 'numeric', // numeric year (e.g., '2023')
		day: 'numeric' // numeric day of the month (e.g., '25')
	};
	const dateOptionsString: Intl.DateTimeFormatOptions = {
		month: 'numeric', // abbreviated month name (e.g., 'Oct')
		year: 'numeric', // numeric year (e.g., '2023')
		day: 'numeric' // numeric day of the month (e.g., '25')
	};
	const timeOptions: Intl.DateTimeFormatOptions = {
		hour: 'numeric', // numeric hour (e.g., '8')
		minute: 'numeric', // numeric minute (e.g., '30')
		hour12: true // use 12-hour clock (true) or 24-hour clock (false)
	};
	const formattedDateTime: string = new Date(dateString).toLocaleString(
		'en-US',
		dateTimeOptions
	);
	const formattedDate: string = new Date(dateString).toLocaleString(
		'en-US',
		dateOptions
	);
	const formattedDateString: string = new Date(dateString).toLocaleString(
		'en-US',
		dateOptionsString
	);
	const formattedDateOnly: string = new Date(dateString).toLocaleString(
		'en-US',
		dateOptionsNoDay
	);
	const formattedTime: string = new Date(dateString).toLocaleString(
		'en-US',
		timeOptions
	);
	return {
		dateTime: formattedDateTime,
		dateOnly: formattedDate,
		dateWithoutDay: formattedDateOnly,
		timeOnly: formattedTime,
		dateString: formattedDateString
	};
};

export function shuffle(array: any[]) {
	const copy = [...array];

	let currentIndex = copy.length;

	// While there remain elements to shuffle...
	while (currentIndex != 0) {
		// Pick a remaining element...
		const randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[copy[currentIndex], copy[randomIndex]] = [
			copy[randomIndex],
			copy[currentIndex]
		];
	}

	return copy;
}

export function setStorageItem(name: string, value: any) {
	localStorage.setItem(name, JSON.stringify(value));
}

export function getStorageItem(name: string) {
	const data = localStorage.getItem(name);

	if (data) {
		return JSON.parse(data);
	}

	return null;
}

export const sanitizeHtmlConfig = {
	allowedTags: [
		'address',
		'article',
		'aside',
		'footer',
		'header',
		'h1',
		'h2',
		'h3',
		'h4',
		'h5',
		'h6',
		'hgroup',
		'main',
		'nav',
		'section',
		'blockquote',
		'dd',
		'div',
		'dl',
		'dt',
		'figcaption',
		'figure',
		'hr',
		'li',
		'main',
		'ol',
		'p',
		'pre',
		'ul',
		'a',
		'abbr',
		'b',
		'bdi',
		'bdo',
		'br',
		'cite',
		'code',
		'i',
		'span',
		'strong',
		'sub',
		'sup',
		'time',
		'u',
		'wbr',
		'caption'
	],
	allowedAttributes: {
		a: ['href', 'target'],
		p: ['class']
	},
	allowedSchemes: ['http', 'https', 'mailto', 'tel'],
	nonTextTags: ['style', 'script', 'textarea', 'option', 'noscript']
};

export function isToday(date: Date) {
	const now = new Date();
	return (
		date.getDate() === now.getDate() &&
		date.getMonth() === now.getMonth() &&
		date.getFullYear() === now.getFullYear()
	);
}

export function getToday(hourAdjustment: number = 4) {
	const serverAdjustedDate = new Date(
		new Date().setHours(new Date().getHours() - hourAdjustment)
	);

	const timezoneOffset = serverAdjustedDate.getTimezoneOffset();

	const todayStart = new Date(
		serverAdjustedDate.getFullYear(),
		serverAdjustedDate.getMonth(),
		serverAdjustedDate.getDate()
	);

	const yesterday = new Date(
		serverAdjustedDate.getFullYear(),
		serverAdjustedDate.getMonth(),
		serverAdjustedDate.getDate() - 1
	);

	const todayEnd = new Date(
		serverAdjustedDate.getFullYear(),
		serverAdjustedDate.getMonth(),
		serverAdjustedDate.getDate() + 1
	);

	const adjustedCurrent = serverAdjustedDate.setHours(
		serverAdjustedDate.getHours() + timezoneOffset / 60
	);

	return {
		yesterday,
		current: adjustedCurrent,
		todayStart: todayStart.toISOString(),
		todayEnd: todayEnd.toISOString(),
		offset: timezoneOffset / 60
	};
}

export function addOneDay(date: Date) {
	const dateCopy = new Date(date);
	dateCopy.setDate(date.getDate() + 1);
	return dateCopy;
}

export function formatUnit(val: number, precision: number = 10) {
	return Math.round(val * precision) / precision;
}

export function truncate(str: string, maxlength: typeof Infinity) {
	return str.length > maxlength ? str.slice(0, maxlength - 3) + '…' : str;
}

export function checkAnagram(str1: string, str2: string) {
	// Remove spaces and convert to lowercase
	str1 = str1.replace(/\s/g, '').toLowerCase();
	str2 = str2.replace(/\s/g, '').toLowerCase();

	// Check if lengths are equal
	if (str1.length !== str2.length) {
		return false;
	}

	// Sort the characters of both strings
	const sortedStr1 = str1.split('').sort().join('');
	const sortedStr2 = str2.split('').sort().join('');

	// Compare sorted strings
	return sortedStr1 === sortedStr2;
}

export function findLettersInWord(str: string, letter: string) {
	const indices = [];
	const word = str.split('');
	for (
		let pos = str.indexOf(letter);
		pos !== -1;
		pos = str.indexOf(letter, pos + 1)
	) {
		indices.push(pos);
	}

	indices.forEach((indx) => {
		delete word[indx];
	});

	return { indices, updatedWord: word.join('') };
}

export function getRandomLetter() {
	const alpha = 'abcdefghijklmnopqrstuvwxyz';
	const arr = alpha.split('');
	const randIndx = Math.floor(Math.random() * arr.length);

	return arr[randIndx];
}
