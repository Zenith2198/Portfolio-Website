import { prisma } from "@/lib/db";

// export const dynamicParams = false;

export default function PostLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-1">
			{children}
		</div>
	);
}

// export async function generateStaticParams() {
// 	const postTypes = await prisma.postType.findMany();

// 	return postTypes.map(({ postTypeId }: { postTypeId: string }) => ({ postTypeId }));
// }

export async function generateMetadata({ params }: { params: { postTypeId: string } }) {
	const postType = await prisma.postType.findUnique({
		where: {
			postTypeId: params.postTypeId
		},
		select: {
			displayName: true
		}
	});

	return {
		title: postType?.displayName
	};
}