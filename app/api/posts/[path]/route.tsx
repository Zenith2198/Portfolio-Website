import { NextResponse } from 'next/server'
import { query } from '@/lib/db';
import { assembleQuery, fixDates, processURL } from '@/lib/utils';
import type { Post } from "@/types/types";

export async function GET(request: Request) {
	const url = new URL(request.url);
	let processedURL = processURL(url);

	const path = url.pathname.split("/").pop();
	processedURL.filter.push(`path,${path}`);

	const hasChapters = processedURL.fields.includes("chapters");
	if (hasChapters) {
		processedURL.fields.splice(processedURL.fields.indexOf("chapters"));
	}

	const queryObj = assembleQuery("posts", processedURL);


	let postDataArr = await query(queryObj) as Array<Post>;

	fixDates(postDataArr);
	let response = postDataArr[0];

	if (!processedURL.fields?.length || hasChapters) {
		response.chapters = await query({
			queryStr: "SELECT * FROM chapters WHERE postId=? ORDER BY chapterNum ASC;",
			values: [response.postId]
		});
		fixDates(response.chapters);
	}

	return NextResponse.json(response);
}