import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { userFindUnique } from "@/lib/db";
import { checkPass } from "@/lib/crypto";

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

				const user = await userFindUnique({
					where: {
						name: credentials.username
					}
				});

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
				token.roleId = user.roleId;
			}
			return token;
		},
		async session ({ session, token }) {
			if (session?.user) {
				session.user.roleId = token.roleId;
			}
			return session;
		}
	}
};