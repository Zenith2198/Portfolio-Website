import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Prisma } from "@prisma/client";
import type { Post, Chapter } from "@prisma/client";
import { ChapterStringContent } from "@/types/types.d";

export async function POST(request: Request) {
	const formData = await request.formData();
	let chapters: Array<Chapter> = JSON.parse(formData.get("chapters") as string);
	chapters.forEach((chapter: Chapter | ChapterStringContent, i: number) => {
		if (chapter.content) {
			//@ts-ignore
			chapter.content = Buffer.from(chapter.content, "utf8");
		}
		chapter.chapterNum = i + 1;
	});
	formData.delete("chapters");
	const image = formData.get("image");
	formData.delete("image");

	let post = {
		dateModified: Math.floor(Date.now() / 1000),
		datePosted: Math.floor(Date.now() / 1000)
	} as Post;
	for (const [name, value] of formData.entries()) {
		//@ts-ignore
		post[name] = value;
	}

	post.path = encodeURIComponent(post.title);

	if (post.primaryStory) {
		post.primaryStory = true;
	}
	if (post.wip) {
		post.wip = true;
	}

	// set up transaction query chain
	try {
		await prisma.$transaction(async (tx) => {
			//remove old primaryStory flag
			if (post.primaryStory) {
				try {
					await tx.post.update({
						where: {
							primaryStory: true
						},
						data: {
							primaryStory: null
						}
					});
				} catch (err) {
					//there is no primary story in the database yet, we want to simply ignore this exception
					if (!(err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025')) {
						throw err;
					}
				}
			}

			if (image) {
				//TODO: upload image to AWS S3 and add URL to post.image
				post.imageLink = `/images/bonebreaker.png`;
			}

			await tx.post.create({
				data: {
					...post,
					chapters: {
						createMany: {
							data: chapters
						}
					}
				}
			});
		});

		return NextResponse.json({ response: "success" });
	} catch (err) {
		if (image) {
			//TODO: remove image from AWS s3 if it got uploaded
		}
		console.log(err)
		return NextResponse.json({ response: "error" });
	}
}