'use client';

import { seedList } from '@/actions/word-actions';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { toast } from 'sonner';
import { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { Squirrel } from 'lucide-react';

export default function DataSeeder() {
	const [isSeeding, setIsSeeding] = useState(false);

	const seedData = async () => {
		setIsSeeding(true);
		const res = await seedList();

		if (res.success) {
			toast(res.message);
		} else {
			toast.error(res.message);
		}

		setIsSeeding(false);
	};

	return (
		<Card className='p-2 py-4'>
			<CardHeader className='p-0'>Seed word data</CardHeader>
			<CardContent className='p-0 flex flex-col items-center'>
				<Button
					disabled={isSeeding}
					onClick={() => seedData()}>
					{isSeeding ? (
						<FaSpinner className='w-4 h-4 animate-spin' />
					) : (
						<Squirrel className='w-4 h-4' />
					)}
					{isSeeding ? 'Seeding...' : 'Seed'}
				</Button>
			</CardContent>
		</Card>
	);
}
