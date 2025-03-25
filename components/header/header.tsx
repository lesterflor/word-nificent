import Link from 'next/link';
import ModeToggle from './mode-toggle';
import UserButton from './user-button';
import { Puzzle } from 'lucide-react';
import { auth } from '@/db/auth';

export default async function SiteHeader() {
	const session = await auth();

	return (
		<header className='w-full border-b fixed top-0 z-50 bg-white dark:bg-blue-950 select-none px-0'>
			<div className='wrapper flex flex-between justify-between items-center w-full p-2'>
				<div className='flex flex-row items-center justify-start gap-5 portrait:gap-0'>
					<Link href='/'>
						<div className='flex flex-row items-center gap-2'>
							<Puzzle className='w-8 h-8' />
							<div className='flex flex-col gap-0'>
								{!session ? (
									<>
										<span className='dark:text-white text-black text-2xl font-bold thin-title'>
											WordNificent
										</span>

										<span className='text-xs'>
											Games and puzzles to test your English vocabulary
										</span>
									</>
								) : (
									<>
										<span className='dark:text-white text-black text-2xl font-bold thin-title portrait:hidden'>
											WordNificent
										</span>

										<span className='text-xs portrait:hidden'>
											Games and puzzles to test your English vocabulary
										</span>
									</>
								)}
							</div>
						</div>
					</Link>
				</div>

				<div className='flex flex-row portrait:flex-col justify-end gap-2 items-center'>
					<div className='hidden lg:block'>
						<ModeToggle />
					</div>

					<UserButton />
				</div>
			</div>
		</header>
	);
}
