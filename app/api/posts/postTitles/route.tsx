import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db';
import type { Prisma } from "@prisma/client";
import { processGETUrl } from '@/lib/utils';

export async function GET(request: Request) {
	const url = new URL(request.url);
	let findMany = processGETUrl(url);

	if (findMany.select) {
		findMany.select = {
			...findMany.select,
			title: true
		};
	}

	const response = await prisma.post.findMany(findMany as Prisma.PostFindManyArgs);

	return NextResponse.json(response);
}