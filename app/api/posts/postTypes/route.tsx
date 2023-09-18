import { NextResponse } from 'next/server'
import { query } from '@/lib/db';
import { buildQuery, processURL } from '@/lib/utils';

export async function GET(request: Request) {
	const url = new URL(request.url);
	const processedURL = processURL(url);
	const queryObj = buildQuery("postTypes", processedURL);

	const response = await query(queryObj);
	return NextResponse.json(response);
}