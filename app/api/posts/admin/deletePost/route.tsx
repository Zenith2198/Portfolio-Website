import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
	const postData = await request.json();

	await prisma.post.delete({
		where: {
			path: postData.path
		}
	});

	return NextResponse.json({ response: "success" });
}