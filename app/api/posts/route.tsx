import { NextResponse } from 'next/server'
import { getSortedPostsNoChapters } from '@/app/api/lib/db';

export async function GET(request: Request) {
	return NextResponse.json({allPostsData: await getSortedPostsNoChapters()});
}