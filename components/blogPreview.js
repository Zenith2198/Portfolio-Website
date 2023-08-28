import { useRouter } from 'next/navigation'

export default function BlogPreview({ path, title, date }) {
	const router = useRouter();

	return (
		<div className="card w-96 bg-base-100 shadow-xl cursor-pointer btn-neutral" onClick={() => router.push(`posts/${path}`)}>
			<div className="card-body">
				<h2 className="card-title">{title}</h2>
				<p>{date}</p>
			</div>
		</div>
	);
}