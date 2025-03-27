import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/db/auth';
import { ThemeProvider } from 'next-themes';
import SiteHeader from '@/components/header/header';
import { Toaster } from '@/components/ui/sonner';
import AddWordProvider from '@/providers/add-word-provider';
import LetterWordProvider from '@/providers/letter-word-provider';
import WinWordProvider from '@/providers/win-provider';

export const metadata: Metadata = {
	title: {
		template: `%s - WordNificent`,
		default: 'Games and puzzles to test your English vocabulary'
	},
	description: 'Games and puzzles to test your English vocabulary.',
	authors: [{ name: 'Lester Flor', url: 'https://lester-flor.vercel.app' }]
};

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 1,
	userScalable: false
};

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth();

	return (
		<html
			lang='en'
			suppressHydrationWarning>
			<body>
				<ThemeProvider
					attribute='class'
					defaultTheme='dark'
					enableSystem
					disableTransitionOnChange>
					<SessionProvider session={session}>
						<AddWordProvider>
							<LetterWordProvider>
								<WinWordProvider>
									<SiteHeader />
									<main className='flex-1 wrapper w-1/2 portrait:w-full portrait:px-3 mx-auto mt-20 select-none'>
										{children}{' '}
									</main>
								</WinWordProvider>
							</LetterWordProvider>
						</AddWordProvider>
					</SessionProvider>
					<Toaster />
				</ThemeProvider>
				<br />
			</body>
		</html>
	);
}
