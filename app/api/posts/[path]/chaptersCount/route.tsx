import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db';
import type { Prisma } from "@prisma/client";
import { processSearchParams } from '@/lib/utils';

export async function GET(request: NextRequest, { params }: { params: {path: string} }) {
	const searchParams = request.nextUrl.searchParams;
	let findUnique = processSearchParams(searchParams);

	findUnique.where = {
		path: encodeURIComponent(params.path)
	};
	if (findUnique.select) {
		findUnique.select = {
			...findUnique.select,
			_count: {
				select: {
					chapters: true
				}
			}
		};
	} else {
		findUnique.select = {
			_count: {
				select: {
					chapters: true
				}
			}
		};
	}
	if (findUnique.include) {
		delete findUnique.include;
	}

	const response = await prisma.post.findUnique(findUnique as Prisma.PostFindUniqueArgs);

	return NextResponse.json(response);
}