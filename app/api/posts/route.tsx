import { NextResponse } from "next/server"
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import type { PostWithChapters } from "@/types/types.d"
import { processGETUrl, fixChaptersArr } from "@/lib/utils";

export async function GET(request: Request) {
	const url = new URL(request.url);
	const findMany = processGETUrl(url);

	let response = await prisma.post.findMany(findMany as Prisma.PostFindManyArgs) as PostWithChapters[];

	if (url.searchParams.get("chapters")) {
		fixChaptersArr(response);
	}

	return NextResponse.json(response);
}