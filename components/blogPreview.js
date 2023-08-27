import { useRouter } from 'next/navigation'

export default function BlogPreview({ path, title, date }) {
	const router = useRouter();

	return (
		<div className='border-2 border-black rounded-2xl p-5 mt-5 mb-5 cursor-pointer shadow-md shadow-gray-500' onClick={() => router.push(`posts/${path}`)}>
			<div className='border-b-2 border-black pb-2'>{title}</div>
			<br/>
			{path}
			<br/>
			{date}
		</div>
	);
}