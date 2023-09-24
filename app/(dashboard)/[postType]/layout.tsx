export default function PostLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-1">
			{children}
		</div>
	);
}

export async function generateStaticParams() {
	const allPostTypesRes = await fetch(`/api/posts/postTypes`, { cache: 'no-store' }); //TODO: remove caching
	const allPostTypes = await allPostTypesRes.json();

	return allPostTypes.map(({ postTypeId }: { postTypeId: string }) => ({ postTypeId }));
}

export async function generateMetadata({ params }: { params: { postType: string } }) {
	const allPostTypesRes = await fetch(`/api/posts/postTypes`, { cache: 'no-store' }); //TODO: remove caching
	const allPostTypes = await allPostTypesRes.json();
	let title = allPostTypes.find((type: { postTypeId:string }) => type.postTypeId === params.postType);

	return {
		title
	};
}