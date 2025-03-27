import { ApiWordDefinition } from '@/types';
import SquirrelSprint from '../squirrel/squirrel-sprint';

export default function ProcessRawWordDefinition({
	data,
	word
}: {
	data: ApiWordDefinition;
	word: string;
}) {
	return (
		<div className='text-sm'>
			<div className='flex flex-col gap-2 relative'>
				{data && data.definitions.length > 0 ? (
					<div
						key={word}
						className='flex flex-col gap-2 w-full items-start'>
						{data.definitions.map((def, indx) => (
							<div key={indx}>
								<div className='text-muted-foreground text-xs'>{def.type}</div>
								<div>{def.definition}</div>
							</div>
						))}
					</div>
				) : (
					<SquirrelSprint />
				)}
			</div>
		</div>
	);
}
