import { NextResponse } from 'next/server'
import { query } from '@/lib/db';
import { assembleQuery, processURL } from '@/lib/utils';

export async function GET(request: Request) {
	const url = new URL(request.url);
	let processedURL = processURL(url);

	processedURL.fields.push("title");

	const queryObj = assembleQuery("posts", processedURL);

	const response = await query(queryObj);
	return NextResponse.json(response);
}