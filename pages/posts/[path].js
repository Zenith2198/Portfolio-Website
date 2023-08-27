import Layout from '../../components/layout';
import { getAllPaths, getPostData } from '../../lib/posts';
import Head from 'next/head';

export default function Post({ postData }) {
	return <Layout>
		<Head>
			<title>{postData.title}</title>
		</Head>
		<h1 className='text-2xl'>{postData.title}</h1>
      	<div>{postData.date}</div>
		<div dangerouslySetInnerHTML={{__html: postData.content}}/>
	</Layout>;
}

export async function getStaticPaths() {
	const paths = await getAllPaths();
	return {
	  	paths,
	  	fallback: false,
	};
}

export async function getStaticProps({ params }) {
	const postData = await getPostData(params.path);
	return {
		props: {
			postData,
		},
	};
}