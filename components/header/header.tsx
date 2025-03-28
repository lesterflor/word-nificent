import Link from 'next/link';
import ModeToggle from './mode-toggle';
import UserButton from './user-button';
import { auth } from '@/db/auth';
import { FaPuzzlePiece } from 'react-icons/fa6';

export default async function SiteHeader() {
	const session = await auth();
	//const user = session?.user as GetUser;

	return (
		<header className='w-full border-b fixed top-0 z-50 bg-white dark:bg-blue-950 select-none px-0'>
			<div className='wrapper flex flex-between justify-between items-center w-full p-2'>
				<div className='flex flex-row items-center justify-start gap-5 portrait:gap-0'>
					<Link href='/'>
						<div className='flex flex-row items-center gap-2'>
							<FaPuzzlePiece className='w-8 h-8' />
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
										<span className='dark:text-white text-black text-2xl font-bold thin-title'>
											WordNificent
										</span>

										<span className='text-xs'>
											Games and puzzles to test your English vocabulary
										</span>
									</>
								)}
							</div>
						</div>
					</Link>

					{/* {user.role === 'admin' && (
						<Sheet>
							<SheetTrigger asChild>
								<Button className='hidden'>Add Word</Button>
							</SheetTrigger>
							<SheetContent className='flex flex-col gap-5 px-4 max-w-[95vw] w-[85vw] portrait:w-[85vw]'>
								<SheetDescription></SheetDescription>
								<SheetTitle>Add Word</SheetTitle>
								<ScrollArea className='w-full h-[85vh] pr-3'>
									<AddWordForm />
									<br />
								</ScrollArea>
							</SheetContent>
						</Sheet>
					)} */}
				</div>

				<div className='flex flex-row justify-end gap-2 items-center'>
					<div>
						<ModeToggle />
					</div>

					<UserButton />
				</div>
			</div>
		</header>
	);
}
