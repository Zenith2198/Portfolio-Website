import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function hashPass(unHashPass) {
	return bcrypt.hash(unHashPass, 10).then(function (hash) {
		return hash;
	});
}

async function load() {
	try {
		await prisma.postType.createMany({
			data: [
				{
					postTypeId: "blogs",
					displayName: "Blogs"
				},
				{
					postTypeId: "short-stories",
					displayName: "Short Stories"
				},
				{
					postTypeId: "long-stories",
					displayName: "Long Stories"
				}
			]
		});

		await prisma.role.create({
			data: {
				roleId: "admin",
				users: {
					create: {
						name: "admin",
						passwordHash: await hashPass("admin")
					}
				}
			}
		});
	} catch (e) {
	  	console.error(e);
	  	process.exit(1);
	} finally {
	  	await prisma.$disconnect();
	}
}

load();