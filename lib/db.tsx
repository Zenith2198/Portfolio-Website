//@ts-nocheck

import { fixDates, sortChapters } from "./utils";
import { remark } from "remark";
import html from "remark-html";
import mysql from "mysql2/promise";
import { Post, Chapter } from "../types/types";

// database functions
export async function query({ query, values = [] }) {
	const dbConn = await mysql.createConnection({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_NAME
	});

	try {
		const [results] = await dbConn.execute<Array<Post | Chapter>>(query, values);
		dbConn.end();
		return results;
	} catch (err) {
		throw err;
	}
}

//get functions
export async function getSortedPostsDataNoChapters() {
	let allPostsDataArr = await query({
		query: "SELECT * FROM posts"
	});

	fixDates(allPostsDataArr);

	return allPostsDataArr.sort((a, b) => {
		if (a.dateModified < b.dateModified) {
			return 1;
		} else {
			return -1;
		}
	});
}

export async function getAllPaths(postType) {
	let q = "SELECT path FROM posts";
	if (postType !== undefined) {
		q = q.concat(` WHERE postType="${postType}"`);
	}
	let allPathsArr = await query({
		query: q
	});

	return allPathsArr;
}

export async function getPostData(path) {
	let postDataArr = await query({
		query: "SELECT * FROM posts WHERE path=?",
		values: [path]
	});

	fixDates(postDataArr);
	let postData = postDataArr[0];
	let chaptersArr = await query({
		query: "SELECT * FROM chapters WHERE postId=?",
		values: [postData.postId.toString()]
	});
	postData.chapters = sortChapters(chaptersArr);

	let remarkedContent = await remark()
		.use(html)
		.process(postData.content);
	postData.content = remarkedContent.toString();

	return postData;
}

export async function getPostTitle(path) {
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
	let chaptersArr = await query({
		query: "SELECT * FROM chapters WHERE postId=?",
		values: [primaryStory.postId.toString()]
	});
	primaryStory.chapters = sortChapters(chaptersArr);

	return primaryStory;
}

export async function getRecentsOfType(type, num=1) {
	let recentsArr = await query({
		query: "SELECT * FROM posts WHERE postType=? ORDER BY dateModified DESC LIMIT ?",
		values: [type, num.toString()]
	});

	fixDates(recentsArr);
	for (const recent of recentsArr) {
		let chaptersArr = await query({
			query: "SELECT * FROM chapters WHERE postId=?",
			values: [recent.postId.toString()]
		});
		recent.chapters = sortChapters(chaptersArr);
	}

	return recentsArr;
}

export async function getUser(username) {
	let userArr = await query({
		query: "SELECT * from users WHERE name=?",
		values: [username]
	});

	let user = userArr[0];

	return user;
}

//set functions