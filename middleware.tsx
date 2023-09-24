import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
	function middleware(request: NextRequestWithAuth) {
		if ((request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname.startsWith("/api/posts/admin")) && request.nextauth.token?.roleId !== "admin") {
			return NextResponse.rewrite(new URL(`${process.env.NEXT_PUBLIC_URL}/denied`, request.url));
		}
	}
);

export const config = { matcher: ["/admin/:path*", "/api/posts/admin/:path*"] };