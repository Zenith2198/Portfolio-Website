import { RowDataPacket } from "mysql2/promise";
//SHOULD MATCH @/schema.sql

export interface Post extends RowDataPacket {
	postId: number,
	title: string,
	dateModified: number | string,
	datePosted: number | string,
	path: string,
	postType: string,
	primaryStory?: boolean,
	image?: string
}

export interface PostTypes extends RowDataPacket {
	postType: string
}

export interface Chapter extends RowDataPacket {
	postId: number,
	number: number,
	title?: string,
	content: string
}

export interface PostTag extends RowDataPacket {
	postId: number,
	tagId: number
}

export interface Tag extends RowDataPacket {
	tagId: number,
	title: string
}

export interface User extends RowDataPacket {
	userId: number,
	name: string,
	passwordHash: string,
	role?: string
}