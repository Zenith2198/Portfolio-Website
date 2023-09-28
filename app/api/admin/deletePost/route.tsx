import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { del } from '@vercel/blob';

export async function POST(request: NextRequest) {
	const postData = await request.json();

	const post = await prisma.post.delete({
		where: {
			path: postData.path
		}
	});

	if (post.imageUrl) {
		await del(post.imageUrl);
	}

	return NextResponse.json({ response: "success" });
}