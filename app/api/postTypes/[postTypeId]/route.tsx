import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db';
import type { Prisma } from "@prisma/client";
import { processSearchParams } from '@/lib/utils';

export async function GET(request: NextRequest, { params }: { params: { postTypeId: string } }) {
	const searchParams = request.nextUrl.searchParams;
	let findMany = processSearchParams(searchParams);

	if (findMany.where) {
		findMany.where = {
			...findMany.where,
			postTypeId: params.postTypeId
		};
	} else {
		findMany.where = {
			postTypeId: params.postTypeId
		};
	}

	let response = await prisma.post.findMany(findMany as Prisma.PostFindManyArgs);

	return NextResponse.json(response);
}