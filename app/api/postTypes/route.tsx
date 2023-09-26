import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db';
import type { Prisma } from "@prisma/client";
import { processSearchParams } from '@/lib/utils';

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const findMany = processSearchParams(searchParams);

	let response = await prisma.postType.findMany(findMany as Prisma.PostTypeFindManyArgs);

	return NextResponse.json(response);
}