import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import type { Post, Chapter } from "@prisma/client";
import { ChapterStringContent } from "@/types/types.d";
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export async function POST(request: NextRequest) {
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

	// const image = formData.get("image") as File;
	// formData.delete("image");

	let post = {
		dateModified: Math.floor(Date.now() / 1000),
		datePosted: Math.floor(Date.now() / 1000)
	} as Post;
	// if (image) {
	// 	post.imageUrl = `${image.name}/${Date.now()}`;
	// }
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
					if (!(err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025")) {
						throw err;
					}
				}
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

			// if (post.imageUrl) {
				// const s3Client = new S3Client({});

				// const uploadCommand = new PutObjectCommand({
				// 	Bucket: process.env.S3_BUCKET_NAME,
				// 	Key: post.imageUrl,
				// 	Body: Buffer.from(image.toString()),
				// 	ContentType: image.type
				// });

				// await s3Client.send(uploadCommand);
			// }
		});

		return NextResponse.json({ response: "success" });
	} catch (err) {
		console.log("ERROR:", err);
		return NextResponse.json({ response: err });
	}
}