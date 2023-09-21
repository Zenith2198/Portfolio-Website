import { NextResponse } from 'next/server';
import type { Post, Query, Table, Chapter } from "@/types/types";
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

	let image = post.image;
	delete post.image;

	// set up transaction query chain
	let queries: Array<(results?: Table) => Query> = [];
	let errors: Array<() => void> = [];
	if (post.edit) {
		delete post.edit;
		delete post.posts;
		queries.push(() => {
			return {
				queryStr: "SELECT datePosted FROM posts WHERE path=?",
				values: [post.path]
			}
		});
		queries.push((results) => {
			if (results) {
				post.datePosted = results[0].datePosted;
			}
			return {
				queryStr: "DELETE FROM posts WHERE path=?;",
				values: [post.path]
			}
		});
	}
	if (post.primaryStory) {
		queries.push(() => {
			return {
				queryStr: "UPDATE posts SET primaryStory=NULL WHERE primaryStory=TRUE;"
			};
		});
	}
	queries.push(() => {
		if (image) {
			//TODO: upload image to AWS S3 and add URL to post.image
			post.image = `${process.env.PUBLIC_URL_DEV}/images/bonebreaker.png`;
		}
		return {
			queryStr: "INSERT INTO posts (??) VALUES (?);",
			values: [Object.keys(post), Object.values(post)]
		};
	});
	if (image) {
		//TODO: remove image from AWS S3
		errors.push(() => {
		
		});
	}
	queries.push((results) => {
		let insertValues: Array<string> = [];
		chapters.forEach((chapter: Chapter, i: number) => {
			chapter.chapterNum = i + 1;
			chapter.postId = results?.insertId;

			insertValues.push("(?)")
		});
		return {
			queryStr: `INSERT INTO chapters (??) VALUES ${insertValues.join(",")};`,
			values: [Object.keys(chapters[0]), ...chapters.map((chapter: Chapter) => {return Object.values(chapter)})]
		};
	});

	// transaction(queries, errors);

	return NextResponse.json({ response: "success" });
}