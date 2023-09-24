import { Session, DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
	interface Session {
		user: {
	  		userId: string,
			name: string,
			roleId: string
		} & DefaultSession
	}

	interface User extends DefaultUser {
		roleId: string
	}
}

declare module "next-auth/jwt" {
	interface JWT extends DefaultJWT {
		roleId: string
	}
}