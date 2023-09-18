import { NextResponse } from 'next/server'
import { query } from '@/lib/db';
import { fixDates, processURL, buildQuery } from '@/lib/utils';
import type { Post } from "@/types/types";

export async function GET(request: Request) {
	const url = new URL(request.url);
	const processedURL = processURL(url);

	const postType = url.pathname.split("/").pop();
	processedURL.filter.push(`postType,${postType}`);

	const queryObj = buildQuery("posts", processedURL);

	let response = await query(queryObj) as Array<Post>;
	fixDates(response);

	for (let post of response) {
		if (processedURL.chapters) {
			post.chapters = await query({
				queryStr: "SELECT * FROM chapters WHERE postId=? ORDER BY chapterNum ASC;",
				values: [post.postId]
			});
			fixDates(post.chapters);
		}
	}

	return NextResponse.json(response);
}