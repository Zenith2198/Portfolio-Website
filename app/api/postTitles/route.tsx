import { NextResponse } from 'next/server'
import { getAllPostTitles } from '@/app/api/lib/db';

export async function GET(request: Request) {
	return NextResponse.json({allPostTitles: await getAllPostTitles()});
}