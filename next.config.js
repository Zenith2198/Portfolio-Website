/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL
	},
	webpack: (config) => {
		config.externals = [...config.externals, 'bcrypt'];
		return config;
	},
	images: {
		domains: ["localhost"]
	}
};

module.exports = nextConfig;
