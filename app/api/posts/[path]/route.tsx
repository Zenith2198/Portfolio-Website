import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db';
import type { Prisma } from "@prisma/client";
import { processGETUrl, fixChapters } from '@/lib/utils';
import type { PostWithChapters } from "@/types/types.d";

export async function GET(request: Request) {
	const url = new URL(request.url);
	const findMany = processGETUrl(url);

	const path = url.pathname.split("/").pop();
	findMany.where = findMany.where ? { ...findMany.where, path } : { path };

	const postDataArr = await prisma.post.findMany(findMany as Prisma.PostFindManyArgs) as PostWithChapters[];

	let response = postDataArr[0];
	if (url.searchParams.get("chapters")) {
		fixChapters(response);
	}

	return NextResponse.json(response);
}