import mysql from "mysql2/promise";
//SHOULD MATCH @/schema.sql

export interface Post extends mysql.RowDataPacket {
	postId: number,
	title: string,
	dateModified: number | string,
	datePosted: number | string,
	path: string,
	postType: string,
	primaryStory: boolean, //optional
	image: string, //optional
}

export interface Chapter extends mysql.RowDataPacket {
	postId: number,
	number: number,
	title: string
}

export interface PostTag extends mysql.RowDataPacket {
	postId: number,
	tagId: number
}

export interface Tag extends mysql.RowDataPacket {
	tagId: number,
	title: string
}

export interface User extends mysql.RowDataPacket {
	userId: number,
	name: string,
	passwordHash: string,
	role: string //optional
}