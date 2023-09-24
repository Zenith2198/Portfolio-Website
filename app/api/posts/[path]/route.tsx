import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db';
import type { Prisma } from "@prisma/client";
import { processGETUrl } from '@/lib/utils2';

export async function GET(request: Request) {
	const url = new URL(request.url);
	const findMany = processGETUrl(url);

	const path = url.pathname.split("/").pop();
	findMany.where = findMany.where ? { ...findMany.where, path } : { path };

	let postDataArr = await prisma.post.findMany(findMany as Prisma.PostFindManyArgs);
	
	let response = postDataArr[0];

	return NextResponse.json(response);
}