/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL
	},
	webpack: (config) => {
		config.externals = [...config.externals, 'bcrypt'];
		return config;
	},
	images: {
		domains: [process.env.NEXT_PUBLIC_VERCEL_URL]
	}
};

module.exports = nextConfig;
