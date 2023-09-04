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
	image?: string,
	wip?: boolean
}

export interface PostType extends RowDataPacket {
	postType: string,
	displayName: string
}

export interface Chapter extends RowDataPacket {
	postId: number,
	chapterNum: number,
	title?: string,
	content: string,
	dateModified: number | string,
	datePosted: number | string,
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

export interface Table extends Post, PostType, PostTag, Tag, User {};

export interface Query {
	queryStr: string,
	values?: Array<string | number | Array<string> | Array<number>>
}