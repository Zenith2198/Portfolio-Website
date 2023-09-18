import { NextResponse } from 'next/server'
import { query } from '@/lib/db';
import { buildQuery, fixDates, processURL } from '@/lib/utils';
import type { Post } from "@/types/types";

export async function GET(request: Request) {
	const url = new URL(request.url);
	let processedURL = processURL(url);

	const path = url.pathname.split("/").pop();
	processedURL.filter.push(`path,${path}`);

	const queryObj = buildQuery("posts", processedURL);


	let postDataArr = await query(queryObj) as Array<Post>;

	fixDates(postDataArr);
	let response = postDataArr[0];

	if (processedURL.chapters) {
		response.chapters = await query({
			queryStr: "SELECT * FROM chapters WHERE postId=? ORDER BY chapterNum ASC;",
			values: [response.postId]
		});
		fixDates(response.chapters);
	}

	return NextResponse.json(response);
}