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
		domains: ["localhost", "https://www.paradoxacrania.com/", "ncfqgd9bsio5uu1z.public.blob.vercel-storage.com"]
	}
};

module.exports = nextConfig;
