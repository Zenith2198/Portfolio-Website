/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		PUBLIC_URL_DEV: process.env.PUBLIC_URL_DEV
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
