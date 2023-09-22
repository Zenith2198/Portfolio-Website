/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		PUBLIC_URL_DEV: process.env.PUBLIC_URL_DEV
	},
	future: {
		webpack5: true
	}
};

module.exports = nextConfig;
