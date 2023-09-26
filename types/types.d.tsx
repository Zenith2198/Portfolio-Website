import type { Prisma, Chapter, Post } from "@prisma/client";

export type PostTypeWithPosts = Prisma.PostTypeGetPayload<{
	include: {
		posts: true
	}
}>;

export interface ChapterStringContent extends Omit<Chapter, "content"> {
	content: string
}

export interface PostWithChapters extends Post {
	chapters: Array<ChapterStringContent>
}

export interface PostWithChaptersCount extends Post {
	_count: {
		chapters: number
	}
}

export type URLParams = {
	fields?: Array<{ key: string, value?: Array<{ whereKey: string, whereValue: string }> }>,
	filter?: Array<{ key: string, value: string }>,
	sort?: Array<{ key: string, desc?: boolean }>
	take?: Number,
	chapters?: boolean | Array<{ whereKey: string, whereValue: string }>
}