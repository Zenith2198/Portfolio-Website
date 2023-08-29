import mysql from "mysql2/promise";

export interface Post extends mysql.RowDataPacket {
	postId: string,
	title: string,
	content: string,
	date: string,
	path: string,
	postType: string,
	primaryStory: boolean,
	category: string
}