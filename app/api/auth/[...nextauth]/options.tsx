import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUser } from "@/app/api/lib/db";
import { checkPass } from "@/app/api/lib/utils";

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
				if (!credentials?.username || !credentials?.password) {
					return null;
				}

				const user = await getUser(credentials.username);

				if (user && credentials.username === user.name && await checkPass(credentials.password, user.passwordHash)) {
					return user;
				} else {
					return null;
				}
			}
		})
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.role = user.role;
			}
			return token;
		},
		async session ({ session, token }) {
			if (session?.user) {
				session.user.role = token.role;
			}
			return session;
		}
	}
};