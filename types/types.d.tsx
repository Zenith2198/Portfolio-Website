import type { Prisma, Chapter } from "@prisma/client";

export type PostWithChaptersTemp = Prisma.PostGetPayload<{
	include: {
		chapters: true
	}
}>;

export type PostTypeWithPosts = Prisma.PostTypeGetPayload<{
	include: {
		posts: true
	}
}>;

export interface ChapterStringContent extends Omit<Chapter, "content"> {
	content: string
}

export interface PostWithChapters extends Omit<PostWithChaptersTemp, "chapters"> {
	chapters: Array<ChapterStringContent>
}