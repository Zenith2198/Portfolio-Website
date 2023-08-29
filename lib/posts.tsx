import { query } from "./db";
import { fixDates } from "./utils";
import { remark } from "remark";
import html from "remark-html";


export async function getSortedPostsData() {
	let allPostsDataArr = await query({
		query: "SELECT * FROM posts"
	});

	fixDates(allPostsDataArr);

	return allPostsDataArr.sort((a, b) => {
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
	let allPathsArr = await query({
		query: q
	});

	return allPathsArr;
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

export async function getPrimaryStory() {
	let primaryStoryArr = await query({
		query: "SELECT * FROM posts WHERE primaryStory=TRUE"
	});

	fixDates(primaryStoryArr);
	let primaryStory = primaryStoryArr[0];

	return primaryStory;
}

export async function getRecentsOfType(type: string, num:number=1) {
	let recentsArr = await query({
		query: "SELECT * FROM posts WHERE postType=? ORDER BY date DESC LIMIT ?",
		values: [type, num.toString()]
	});

	fixDates(recentsArr);

	return recentsArr;
}