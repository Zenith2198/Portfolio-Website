import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
	const postData = await request.json();

	//TODO: make edit page smartly update only the changed fields

	return NextResponse.json({ response: "success" });
}