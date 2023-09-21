import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: Request) {
	const postData = await request.json();

	const response = await query({
		queryStr: "DELETE FROM posts WHERE path=?;",
		values: [postData.path]
	});

	return NextResponse.json({ response: "success" });
}