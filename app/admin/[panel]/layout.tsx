export default function PanelLayout({ children, params }: { children: React.ReactNode, params: { panel: string } }) {
	return (
		<div>
			{children}
		</div>
	);
}

export async function generateStaticParams() {
	return [
		{ "panel": "newPost" },
		{ "panel": "editPost" }
	];
}

export async function generateMetadata({ params }: { params: { panel: string } }) {
	return {
		title: `Admin Page: ${params.panel}`
	};
}