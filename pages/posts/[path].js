import Layout from '../../components/layout';
import { getAllPaths, getPostData, getSortedPostsData } from '../../lib/posts';
import Head from 'next/head';

export default function Post({ allPostsData, postData }) {
	return (
		<Layout allPostsData={allPostsData}>
			<Head>
				<title>{postData.title}</title>
			</Head>
			<h1 className='text-5xl'>{postData.title}</h1>
			<div>{postData.date}</div>
			<div className='m-20'>
				<div className='m-20' dangerouslySetInnerHTML={{__html: postData.content}}/>
			</div>
		</Layout>
	);
}

export async function getStaticPaths() {
	const paths = await getAllPaths();
	return {
	  	paths,
	  	fallback: false,
	};
}

export async function getStaticProps({ params }) {
	const allPostsData = await getSortedPostsData();
	const postData = await getPostData(params.path);
	return {
		props: {
			allPostsData, postData
		},
	};
}