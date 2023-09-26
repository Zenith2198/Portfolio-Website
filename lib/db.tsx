import { PrismaClient } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { cache } from 'react';

//database initialization
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
	globalForPrisma.prisma ||
	new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

//server-side database functions
export const revalidate = 1;

export const postFindUnique = cache(async (query: Prisma.PostFindUniqueArgs) => {
	return await prisma.post.findUnique(query);
});

export const postFindMany = cache(async (query: Prisma.PostFindManyArgs) => {
	return await prisma.post.findMany(query);
});

export const postTypeFindUnique = cache(async (query: Prisma.PostTypeFindUniqueArgs) => {
	return await prisma.postType.findUnique(query);
});