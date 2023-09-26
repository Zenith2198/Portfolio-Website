import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Prisma } from "@prisma/client";
import type { Post } from "@prisma/client";

export async function POST(request: Request) {
	const formData = await request.formData();
	const oldTitle = formData.get("oldTitle") as string;
	formData.delete("oldTitle");

	let chaptersObj = JSON.parse(formData.get("chapters") as string);
	formData.delete("chapters");

	const chaptersDeleted = JSON.parse(formData.get("chaptersDeleted") as string);
	formData.delete("chaptersDeleted");
	const image = formData.get("image");
	formData.delete("image");

	let post = {
		dateModified: Math.floor(Date.now() / 1000)
	} as Post;
	for (const [name, value] of formData.entries()) {
		if (value === "true" || value === "false") {
			//@ts-ignore
			post[name] = JSON.parse(value);
		} else {
			//@ts-ignore
			post[name] = value;
		}
	}

	if (post.title) {
		post.path = encodeURIComponent(post.title);
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

			const { postId } = await tx.post.update({
				where: {
					title: oldTitle
				},
				select: {
					postId: true
				},
				data: post
			});

			for (const k in chaptersObj) {
				if (chaptersObj[k].content) {
					chaptersObj[k].content = Buffer.from(chaptersObj[k].content, "utf8");
				}
				await tx.chapter.upsert({
					where: {
						postId_chapterNum: {
							postId,
							chapterNum: Number(k)+1
						}
					},
					update: {
						...chaptersObj[k]
					},
					create: {
						postId,
						chapterNum: Number(k)+1,
						...chaptersObj[k]
					}
				});
			}

			if (chaptersDeleted) {
				for (const chapterNum of chaptersDeleted) {
					await tx.chapter.delete({
						where: {
							postId_chapterNum: {
								postId,
								chapterNum
							}
						}
					});
				}
			}
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