import type { Prisma } from "@prisma/client";

export type PostWithChapters = Prisma.PostGetPayload<{
	include: {
		chapters: true
	}
}>;

export type PostTypeWithPosts = Prisma.PostTypeGetPayload<{
	include: {
		posts: true
	}
}>;