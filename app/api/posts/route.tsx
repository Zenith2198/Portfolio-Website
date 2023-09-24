import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db';
import type { Prisma } from "@prisma/client";
import { processGETUrl } from '@/lib/utils2';

export async function GET(request: Request) {
	const url = new URL(request.url);
	const findMany = processGETUrl(url);

	let response = await prisma.post.findMany(findMany as Prisma.PostFindManyArgs);

	return NextResponse.json(response);
}