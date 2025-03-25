import { auth } from '@/db/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
	const session = await auth();

	if (!session) {
		redirect('/sign-in');
	}

	return (
		<div className='flex flex-col gap-2'>
			<div>Home</div>
			<div>Word-Nificent</div>
		</div>
	);
}
