import { Session } from "next-auth";

declare module "next-auth" {
	interface Session {
	  sessionId: string
	}
  
	interface User {
	  userId: string,
	  username: string
	}
  }