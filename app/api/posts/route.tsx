import { NextResponse } from 'next/server'
import { query } from '@/lib/db';
import { fixDates, processURL, assembleQuery } from '@/lib/utils';
import type { Post } from "@/types/types";

export async function GET(request: Request) {
	const url = new URL(request.url);
	const processedURL = processURL(url);

	const hasChapters = processedURL.fields.includes("chapters");
	if (hasChapters) {
		processedURL.fields.splice(processedURL.fields.indexOf("chapters"));
	}

	const queryObj = assembleQuery("posts", processedURL);

	let response = await query(queryObj) as Array<Post>;

	fixDates(response);

	for (let post of response) {
		if (!processedURL.fields?.length || hasChapters) {
			post.chapters = await query({
				queryStr: "SELECT * FROM chapters WHERE postId=? ORDER BY chapterNum ASC;",
				values: [post.postId]
			});
			fixDates(post.chapters);
		}
	}

	return NextResponse.json(response);
}