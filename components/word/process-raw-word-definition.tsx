import { ApiWordDefinition } from '@/types';
import { Squirrel } from 'lucide-react';
import React from 'react';

export default function ProcessRawWordDefinition({
	data,
	word
}: {
	data: ApiWordDefinition;
	word: string;
}) {
	return (
		<div className='text-xs'>
			{data === null ? (
				<Squirrel className='w-12 h-12' />
			) : (
				<div className='flex flex-col gap-2'>
					{data && (
						<div
							key={word}
							className='flex flex-col gap-0 w-full items-start'>
							{data.definitions.map((def, indx) => (
								<div key={indx}>
									<div className='text-muted-foreground text-xs'>
										{def.type}
									</div>
									<div>{def.definition}</div>
								</div>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
