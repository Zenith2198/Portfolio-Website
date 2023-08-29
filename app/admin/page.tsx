import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

export default async function Admin() {
	const session = await getServerSession(authOptions);

	if (session) {
	  // Signed in
	  console.log("logged in");
	} else {
	  // Not Signed in
	  console.log("not logged in");
	}
  }