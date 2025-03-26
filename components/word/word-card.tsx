'use client';

import { GetWord } from '@/types';
import { Card, CardContent, CardHeader } from '../ui/card';

export default function WordCard({ word }: { word: GetWord }) {
	return (
		<Card className='p-2 pb-4'>
			<CardHeader className='text-3xl px-2'>{word.name}</CardHeader>
			<CardContent className='flex flex-col gap-3 px-2'>
				{word.definitions.map((def) => (
					<div
						key={def.id}
						className='flex flex-col gap-0'>
						<div className='text-muted-foreground text-xs'>{def.type}</div>
						<div className='text-sm'>{def.description}</div>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
