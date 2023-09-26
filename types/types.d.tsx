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