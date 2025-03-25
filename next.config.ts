import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'utfs.io',
				port: ''
			},
			{
				protocol: 'http',
				hostname: 'lesterflor.com',
				port: ''
			},
			{
				protocol: 'https',
				hostname: 'avatars.githubusercontent.com',
				port: ''
			},
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
				port: ''
			}
		]
	}
};

export default nextConfig;
