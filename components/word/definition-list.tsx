'use client';

import { useContext, useEffect, useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { WordDefinition } from '@/types';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Plus, X } from 'lucide-react';
import { AddWordContext } from '@/contexts/add-word-context';

export default function DefinitionList({
	onChange
}: {
	onChange: (data: WordDefinition[]) => void;
}) {
	const [defs, setDefs] = useState<WordDefinition[]>([]);
	const [seletedType, setSelectedType] = useState('');
	const [defText, setDefText] = useState('');
	const addWordContext = useContext(AddWordContext);

	const addDefinition = () => {
		const newDef: WordDefinition = {
			id: `${new Date().getTime()}`,
			type: seletedType,
			description: defText,
			wordId: ''
		};

		const update = [...defs];
		update.push(newDef);
		setDefs(update);
	};

	const removeDefinition = (id: string) => {
		const cleaned = defs.filter((item) => item.id !== id);

		setDefs(cleaned);
	};

	useEffect(() => {
		onChange(defs);

		// clear the form
		setSelectedType('');
		setDefText('');
	}, [defs]);

	useEffect(() => {
		if (addWordContext?.word) {
			setDefs([]);
		}
	}, [addWordContext]);

	return (
		<div className='flex flex-col gap-4'>
			<div className='flex flex-col items-center gap-2 justify-between w-full'>
				{defs.length > 0 &&
					defs.map((item) => (
						<div
							key={item.id}
							className='flex flex-row items-center justify-between gap-4 w-full'>
							<div className='text-muted-foreground'>{item.type}</div>
							<div className='text-xs'>{item.description}</div>
							<div>
								<Button
									variant='outline'
									onClick={(e) => {
										e.preventDefault();
										removeDefinition(item.id as string);
									}}>
									<X className='w-4 h-4' />
								</Button>
							</div>
						</div>
					))}
			</div>

			<Card className='px-0'>
				<CardContent className='px-2'>
					<div className='flex flex-col gap-4 items-center'>
						<ToggleGroup
							variant='outline'
							className='w-full'
							type='single'
							value={seletedType}
							onValueChange={setSelectedType}>
							<ToggleGroupItem
								value='noun'
								className='text-xs p-2'>
								Noun
							</ToggleGroupItem>
							<ToggleGroupItem
								value='verb'
								className='text-xs'>
								Verb
							</ToggleGroupItem>
							<ToggleGroupItem
								value='adjective'
								className='text-xs'>
								Adjective
							</ToggleGroupItem>
							<ToggleGroupItem
								value='adverb'
								className='text-xs'>
								Adverb
							</ToggleGroupItem>
							<ToggleGroupItem
								value='interjection'
								className='text-xs'>
								Interjection
							</ToggleGroupItem>
						</ToggleGroup>

						<Textarea
							className='w-full h-[65px]'
							value={defText}
							onChange={(e) => {
								setDefText(e.target.value);
							}}
						/>

						<Button
							disabled={!defText || !seletedType}
							className='w-fit'
							variant='secondary'
							onClick={(e) => {
								e.preventDefault();
								addDefinition();
							}}>
							<Plus className='w-4 h-4' />
							Add Definition
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
