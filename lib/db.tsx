import mysql from "mysql2/promise";
import SqlString from "sqlstring";
import type * as DBTypes from "@/types/types";

// database functions
let globalPool: mysql.Pool | undefined = undefined;

async function dbConnect() {
	if(typeof globalPool !== 'undefined') {
		return await globalPool.getConnection();
	}

	globalPool = await mysql.createPool({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_NAME,
		connectionLimit: 10
	});
	return await globalPool.getConnection();
}

export async function query({ query, values = [] }: {
	query: string,
	values?: Array<string | number | Array<string> | Array<number>>
}): Promise<Array<DBTypes.Post | DBTypes.PostType | DBTypes.Chapter | DBTypes.PostTag | DBTypes.Tag | DBTypes.User>> {
	const queryStr = SqlString.format(query, values);
	try {
		const dbConnection = await dbConnect();
		const [err, results] = await dbConnection.query(queryStr);
		dbConnection.release();
		if (err) {
			//@ts-ignore
			return err;
		}
		//@ts-ignore
		return results;
	} catch (err) {
		throw err;
	}
}

//get functions
export async function getUser(username: string) {
	let userArr = await query({
		query: "SELECT * from users WHERE name=?;",
		values: [username]
	});

	let user = userArr[0];

	return user;
}

// export async function getSortedPostsNoChapters():Array<Post> {
// 	let allPostsDataArr = await query2({
// 		query: "SELECT * FROM posts ORDER BY dateModified DESC;"
// 	});

// 	fixDates(allPostsDataArr);

// 	return allPostsDataArr;
// }

// export async function getAllPostTypes():Array<PostType> {
// 	return await query2({
// 		query: "SELECT * from postTypes"
// 	});
// }

// export async function getAllPaths(postType):Array<Post> {
// 	return await query2({
// 		query: "SELECT path FROM posts WHERE postType=?;",
// 		values: [postType]
// 	});
// }

// export async function getPostData(path) {
// 	let postDataArr = await query2({
// 		query: "SELECT * FROM posts WHERE path=?;",
// 		values: [path]
// 	});

// 	fixDates(postDataArr);
// 	let postData = postDataArr[0];
// 	postData.chapters = await getChapters(postData.postId);

// 	// let remarkedContent = await remark()
// 	// 	.use(html)
// 	// 	.process(postData.content);
// 	// postData.content = remarkedContent.toString();

// 	return postData;
// }

// export async function getPostTitle(path) {
// 	let postTitleArr = await query2({
// 		query: "SELECT title FROM posts WHERE path=?;",
// 		values: [path]
// 	});

// 	let postTitle = postTitleArr[0];

// 	return postTitle;
// }

// export async function getPrimaryStory() {
// 	let primaryStoryArr = await query2({
// 		query: "SELECT * FROM posts WHERE primaryStory=TRUE;"
// 	});

// 	fixDates(primaryStoryArr);
// 	primaryStoryArr[0].chapters = await getChapters(primaryStoryArr[0].postId);

// 	return primaryStoryArr;
// }

// export async function getRecentsOfPostType(postType, num=1) {
// 	let recentsArr = await query2({
// 		query: "SELECT * FROM posts WHERE postType=? ORDER BY dateModified DESC LIMIT ?;",
// 		values: [postType, num.toString()]
// 	});

// 	fixDates(recentsArr);
// 	for (const recent of recentsArr) {
// 		recent.chapters = await getChapters(recent.postId);
// 	}

// 	return recentsArr;
// }

// export async function getSortedOfPostTypeNoChapters(postType):Array<Post> {
// 	return await query2({
// 		query: "SELECT * FROM posts WHERE postType=? ORDER BY title ASC;",
// 		values: [postType]
// 	});
// }

// export async function getChapters(postId) {
// 	return await query2({
// 		query: "SELECT * FROM chapters WHERE postId=? ORDER BY chapterNum ASC;",
// 		values: [postId]
// 	});
// }

// export async function getTest() {
// 	return {test: "valid"}
// }

// export async function getAllPostTitles() {
// 	const allPostTitles = await query2({
// 		query: "SELECT title FROM posts;"
// 	});
// 	return allPostTitles.map(obj => obj.title);
// }

//set functions
export async function setImageOfPost(file, path) {
	return await query2({
		query: "UPDATE posts SET image=? WHERE path=?;",
		values: [file, path]
	})
}

export async function setNewPost(post, chapters) {
	post.dateModified = Date.now() / 1000;
	post.datePosted = Date.now() / 1000;
	post.path = encodeURIComponent(post.title);

	if (post.primaryStory) {
		const unsetPrimaryStory =  await query2({
			query: "UPDATE posts SET primaryStory=NULL WHERE primaryStory=TRUE"
		})
	}
	
	console.log(1)
	for (const k in post) {
		if (typeof post[k] === "string") {
			post[k] = post[k].replace("'", "\\'");
		}
	}
	console.log(1)
	const postInsert =  await query2({
		query: "INSERT INTO posts (" + Object.keys(post).join(",") + ") VALUES ('" + Object.values(post).join("','") + "');"
	})

	console.log(1)
	let chaptersStrArr = [];
	chapters.forEach((chapter, i) => {
		console.log(chapter)
		chapter.chapterNum = i;
		chapter.postId = postInsert.insertId;

		chaptersStrArr.push("('"
			+ chapter.title.replace("'", "\\'") + "','"
			+ chapter.content.replace("'", "\\'") + "','"
			+ i + "','"
			+ postInsert.insertId
			+ "')");
	});
	const chapterInsert =  await query2({
		query: "INSERT INTO chapters (" + Object.keys(chapters[0]).join(",") + ") VALUES " + chaptersStrArr.join(",") + ";",
		values: [chapters.map((chapter) => {return Object.values(chapter)})]
	})

	return;
}