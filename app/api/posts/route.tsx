import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import type { PostWithChapters } from "@/types/types.d"
import { processSearchParams, fixChaptersArr } from "@/lib/utils";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const findMany = processSearchParams(searchParams);

	let response = await prisma.post.findMany(findMany as Prisma.PostFindManyArgs) as PostWithChapters[];

	if (searchParams.get("chapters")) {
		fixChaptersArr(response);
	}

	return NextResponse.json(response);
}