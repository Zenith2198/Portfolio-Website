import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				username: {
					label: "Username",
					type: "text"
				},
				password: {
					label: "Password",
					type: "password"
				}
			},
			//@ts-ignore
			async authorize(credentials) {
				// Add logic here to look up the user from the credentials supplied
				const user = { userId: "1", username: "admin", password: "admin" };
				console.log(1)
				console.log(credentials)

				if (credentials?.username === user.username && credentials?.password === user.password) {
					return user;
				} else {
					return null;
				}
			}
		})
	]
};