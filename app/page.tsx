import { getWords } from '@/actions/word-actions';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetTitle,
	SheetTrigger
} from '@/components/ui/sheet';
import AddWordForm from '@/components/word/add-word-form';
import WordCard from '@/components/word/word-card';
import { auth } from '@/db/auth';
import { GetWord } from '@/types';
import { redirect } from 'next/navigation';

export default async function Home() {
	const session = await auth();

	if (!session) {
		redirect('/sign-in');
	}

	const words = await getWords();

	const wordList = (words.data as GetWord[]) ?? [];

	return (
		<div className='flex flex-col gap-2'>
			<div>Word-Nificent</div>
			<div>
				<Sheet>
					<SheetTrigger asChild>
						<Button>Add Word</Button>
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
			</div>

			<div className='portrait:flex flex-col grid grid-cols-2 gap-4'>
				{wordList.map((word) => (
					<WordCard
						key={word.id}
						word={word}
					/>
				))}
			</div>
		</div>
	);
}
