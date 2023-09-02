//@ts-nocheck

import { fixDates } from "./utils";
import { remark } from "remark";
import html from "remark-html";
import mysql from "mysql2/promise";
import type { Post, PostType } from "@/types/types";

// database functions
export async function query({ query, values = [] }) {
	const dbConn = await mysql.createConnection({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_NAME
	});

	try {
		const [err, results] = await dbConn.execute(query, values);
		dbConn.end();
		if (err) {
			return err;
		}
		return results;
	} catch (err) {
		throw err;
	}
}

//get functions
export async function getSortedPostsNoChapters():Array<Post> {
	let allPostsDataArr = await query({
		query: "SELECT * FROM posts ORDER BY dateModified DESC;"
	});

	fixDates(allPostsDataArr);

	return allPostsDataArr;
}

export async function getAllPostTypes():Array<PostType> {
	return await query({
		query: "SELECT * from postTypes"
	});
}

export async function getAllPaths(postType):Array<Post> {
	return await query({
		query: "SELECT path FROM posts WHERE postType=?;",
		values: [postType]
	});
}

export async function getPostData(path) {
	let postDataArr = await query({
		query: "SELECT * FROM posts WHERE path=?;",
		values: [path]
	});

	fixDates(postDataArr);
	let postData = postDataArr[0];
	postData.chapters = await getChapters(postData.postId);

	let remarkedContent = await remark()
		.use(html)
		.process(postData.content);
	postData.content = remarkedContent.toString();

	return postData;
}

export async function getPostTitle(path) {
	let postTitleArr = await query({
		query: "SELECT title FROM posts WHERE path=?;",
		values: [path]
	});

	let postTitle = postTitleArr[0];

	return postTitle;
}

export async function getPrimaryStory() {
	let primaryStoryArr = await query({
		query: "SELECT * FROM posts WHERE primaryStory=TRUE;"
	});

	fixDates(primaryStoryArr);
	primaryStoryArr[0].chapters = await getChapters(primaryStoryArr[0].postId);

	return primaryStoryArr;
}

export async function getRecentsOfPostType(postType, num=1) {
	let recentsArr = await query({
		query: "SELECT * FROM posts WHERE postType=? ORDER BY dateModified DESC LIMIT ?;",
		values: [postType, num.toString()]
	});

	fixDates(recentsArr);
	for (const recent of recentsArr) {
		recent.chapters = await getChapters(recent.postId);
	}

	return recentsArr;
}

export async function getSortedOfPostTypeNoChapters(postType):Array<Post> {
	return await query({
		query: "SELECT * FROM posts WHERE postType=? ORDER BY title ASC;",
		values: [postType]
	});
}

export async function getUser(username) {
	let userArr = await query({
		query: "SELECT * from users WHERE name=?;",
		values: [username]
	});

	let user = userArr[0];

	return user;
}

export async function getChapters(postId) {
	return await query({
		query: "SELECT * FROM chapters WHERE postId=? ORDER BY chapterNum ASC;",
		values: [postId]
	});
}

export async function getTest() {
	return {test: "valid"}
}

export async function getAllPostTitles() {
	const allPostTitles = await query({
		query: "SELECT title FROM posts;"
	});
	return allPostTitles.map(obj => obj.title);
}

//set functions
export async function setImageOfPost(file, path) {
	return await query({
		query: "UPDATE posts SET image=? WHERE path=?;",
		values: [file, path]
	})
}

export async function setNewPost(post, chapters) {
	post.dateModified = Date.now() / 1000;
	post.datePosted = Date.now() / 1000;
	post.path = encodeURIComponent(post.title);

	if (post.primaryStory) {
		const unsetPrimaryStory =  await query({
			query: "UPDATE posts SET primaryStory=NULL WHERE primaryStory=TRUE"
		})
	}
	const postInsert =  await query({
		query: "INSERT INTO posts (" + Object.keys(post).join(",") + ") VALUES ('" + Object.values(post).join("','") + "');"
	})
	
	chapters.forEach((chapter, i) => {
		chapter.chapterNum = i;
		chapter.postId = postInsert.insertId;
	});
	let chaptersStr = chapters.map((chapter) => {
		return "('" + Object.values(chapter).join("','") + "')";
	}).join(",");
	const chapterInsert =  await query({
		query: "INSERT INTO chapters (" + Object.keys(chapters[0]).join(",") + ") VALUES " + chaptersStr + ";",
		values: [chapters.map((chapter) => {return Object.values(chapter)})]
	})

	return;
}