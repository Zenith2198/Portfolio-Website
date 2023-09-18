export const dynamicParams = false;

export default async function Chapter({ params }: { params: { path: string, chapterNum: string } }) {
	return (
		<div>
			HI IS IT WORKING?
		</div>
	);
}