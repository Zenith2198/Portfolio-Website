import { query } from "./db";
import { fixDates } from "./utils";
import { remark } from "remark";
import html from "remark-html";


export async function getSortedPostsData() {
	let allPostsData = await query({
		query: "SELECT * FROM posts"
	});

	fixDates(allPostsData);

	return allPostsData.sort((a, b) => {
		if (a.date < b.date) {
			return 1;
		} else {
			return -1;
		}
	});
}

export async function getAllPaths(postType?: string) {
	let q = "SELECT path FROM posts";
	if (postType !== undefined) {
		q = q.concat(` WHERE postType="${postType}"`);
	}
	let allPaths = await query({
		query: q
	});

	return allPaths;
}

export async function getPostData(path: string) {
	let postDataArr = await query({
		query: "SELECT * FROM posts WHERE path=?",
		values: [path]
	});

	fixDates(postDataArr);
	let postData = postDataArr[0];

	let remarkedContent = await remark()
		.use(html)
		.process(postData.content);
	postData.content = remarkedContent.toString();

	return postData;
}

export async function getPostTitle(path: string) {
	let postTitleArr = await query({
		query: "SELECT title FROM posts WHERE path=?",
		values: [path]
	});

	let postTitle = postTitleArr[0];

	return postTitle;
}