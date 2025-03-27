'use client';

import { useEffect, useRef } from 'react';
import { GiSquirrel } from 'react-icons/gi';
import { useInView } from 'react-intersection-observer';

export default function SquirrelSprint() {
	const [ref, isIntersecting] = useInView();
	const squirrel1 = useRef<HTMLDivElement>(null);
	const squirrel2 = useRef<HTMLDivElement>(null);
	const squirrel3 = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isIntersecting) {
			if (squirrel1.current) {
				squirrel1.current.style.left = '500px';
			}
			if (squirrel2.current) {
				squirrel2.current.style.left = '500px';
			}
			if (squirrel3.current) {
				squirrel3.current.style.left = '500px';
			}
		}
	}, [isIntersecting]);

	return (
		<div className='relative'>
			<div ref={ref}>
				<div
					ref={squirrel1}
					className='absolute transition-all left-0 delay-1200 opacity-20 ease-in-out h-16 flex flex-col items-center justify-center duration-1000'>
					<GiSquirrel className='w-8 h-8 animate-bounce' />
				</div>
				<div
					ref={squirrel2}
					className='absolute transition-all left-0 delay-1100 opacity-50 ease-in-out h-16 flex flex-col items-center justify-center duration-1000'>
					<GiSquirrel className='w-8 h-8 animate-bounce' />
				</div>
				<div
					ref={squirrel3}
					className='absolute transition-all left-0 delay-1000 ease-in-out h-16 flex flex-col items-center justify-center duration-1000'>
					<GiSquirrel className='w-8 h-8 animate-bounce' />
				</div>
			</div>
		</div>
	);
}
