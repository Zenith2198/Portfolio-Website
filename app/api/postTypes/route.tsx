import { NextResponse } from 'next/server'
import { getAllPostTypes } from '@/app/api/lib/db';

export async function GET(request: Request) {
	return NextResponse.json({allPostTypes: await getAllPostTypes()});
}