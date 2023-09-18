export default async function PostLayout({ children }: { children: React.ReactNode }) {
	return (
		<div>
			{children}
		</div>
	);
}

export async function generateStaticParams() {
	const allPostTypesRes = await fetch(`${process.env.PUBLIC_URL_DEV}/api/posts/postTypes`, { cache: 'no-store' }); //TODO: remove caching
	const allPostTypes = await allPostTypesRes.json();

	return allPostTypes.map(({ postType }: { postType: string }) => ({ postType }));
}

export async function generateMetadata({ params }: { params: { postType: string } }) {
	const allPostTypesRes = await fetch(`${process.env.PUBLIC_URL_DEV}/api/posts/postTypes`, { cache: 'no-store' }); //TODO: remove caching
	const allPostTypes = await allPostTypesRes.json();
	let title = allPostTypes.find((type: { postType:string }) => type.postType === params.postType).displayName;

	return {
		title
	};
}