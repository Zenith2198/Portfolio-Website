import { NextResponse } from 'next/server'
import type { Post, Query, Table, Chapter } from "@/types/types"
import { transaction } from '@/lib/db';

export async function POST(request: Request) {
	const formData = await request.formData();

	//@ts-ignore
	const chapters = JSON.parse(formData.get("chapters"));
	formData.delete("chapters");
	let post: Post = {
		dateModified: Math.floor(Date.now() / 1000),
		datePosted: Math.floor(Date.now() / 1000)
	} as Post;
	//@ts-ignore
	for (const [name, value] of formData.entries()) {
		//@ts-ignore
		post[name] = value;
	}

	post.path = encodeURIComponent(post.title);

	for (const k in post) {
		if (typeof post[k] === "string") {
			post[k] = post[k].replace("'", "\\'");
		}
	}

	let queries: Array<(err?: Table, results?: Table) => Query> = [];
	if (post.primaryStory) {
		queries.push(() => {
			return {
				queryStr: "UPDATE posts SET primaryStory=NULL WHERE primaryStory=TRUE;"
			}
		});
	}
	queries.push(() => {
		return {
			queryStr: `INSERT INTO posts (??) VALUES (?);`,
			values: [Object.keys(post), Object.values(post)]
		}
	});
	queries.push((results) => {
		let insertValues: Array<string> = [];
		chapters.forEach((chapter: Chapter, i: number) => {
			chapter.chapterNum = i;
			chapter.postId = results?.insertId;
			chapter.dateModified = Math.floor(Date.now() / 1000);
			chapter.datePosted = Math.floor(Date.now() / 1000);

			insertValues.push("(?)")
		});
		return {
			queryStr: `INSERT INTO chapters (??) VALUES ${insertValues.join(",")};`,
			values: [Object.keys(chapters[0]), ...chapters.map((chapter: Chapter) => {return Object.values(chapter)})]
		}
	});

	transaction(queries);

	return NextResponse.json({ response: "success" });
}