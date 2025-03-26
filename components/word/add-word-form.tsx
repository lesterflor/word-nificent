'use client';

import { wordSchema } from '@/lib/validators';
import React, { useContext, useState } from 'react';
import { ControllerRenderProps, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addWord } from '@/actions/word-actions';
import { WordDefinition } from '@/types';
import { toast } from 'sonner';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '../ui/form';
import { Input } from '../ui/input';
import DefinitionList from './definition-list';
import { Button } from '../ui/button';
import { FaSpinner } from 'react-icons/fa';
import { Plus } from 'lucide-react';
import { AddWordContext } from '@/contexts/add-word-context';

export default function AddWordForm() {
	const [defs, setDefs] = useState<WordDefinition[]>([]);
	const addWordContext = useContext(AddWordContext);

	const form = useForm<z.infer<typeof wordSchema>>({
		resolver: zodResolver(wordSchema),
		defaultValues: {
			name: ''
		}
	});

	const onSubmit: SubmitHandler<z.infer<typeof wordSchema>> = async (
		values
	) => {
		const res = await addWord(values, defs);

		if (res.success) {
			toast(res.message);
			form.reset();
			setDefs([]);

			if (addWordContext?.updated) {
				const update = {
					...addWordContext,
					word: values.name
				};
				addWordContext.updated(update);
			}
		} else {
			toast.error(res.message);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className='flex flex-col gap-4 px-1'>
					<FormField
						name='name'
						control={form.control}
						render={({
							field
						}: {
							field: ControllerRenderProps<z.infer<typeof wordSchema>, 'name'>;
						}) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<DefinitionList
						onChange={(list) => {
							setDefs(list);
						}}
					/>

					<div className='pt-5'>
						<Button
							type='submit'
							disabled={form.formState.isSubmitting}>
							{form.formState.isSubmitting ? (
								<FaSpinner className='w-4 h-4 animate-spin' />
							) : (
								<Plus className='w-4 h-4' />
							)}
							{form.formState.isSubmitting ? 'Adding Word...' : 'Add Word'}
						</Button>
					</div>
				</div>
			</form>
		</Form>
	);
}
