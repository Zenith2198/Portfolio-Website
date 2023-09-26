import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db';
import type { Prisma } from "@prisma/client";
import { processSearchParams, fixChapters } from '@/lib/utils';
import type { PostWithChapters } from "@/types/types.d";

export async function GET(request: NextRequest, { params }: { params: {path: string} }) {
	const searchParams = request.nextUrl.searchParams;
	let findUnique = processSearchParams(searchParams);

	findUnique.where = {
		path: encodeURIComponent(params.path)
	};

	const response = await prisma.post.findUnique(findUnique as Prisma.PostFindUniqueArgs) as PostWithChapters;

	if (searchParams.get("chapters")) {
		fixChapters(response);
	}

	return NextResponse.json(response);
}