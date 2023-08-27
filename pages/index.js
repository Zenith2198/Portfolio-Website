'use client';

import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import { getSortedPostsData } from '../lib/posts';
import BlogPreview from '../components/blogPreview';

export default function Home({ allPostsData }) {
	return (
    	<Layout home>
    		<Head>
        		<title>{siteTitle}</title>
    		</Head>
    		<section className='p-1 text-2xl'>
				<h1>Hello, Paig here.</h1>
    			<h2 className='text-3xl'>Blog</h2>
				<ul>
					{allPostsData.map(({ path, title, date }) => (
						<li key={path}>
							<BlogPreview path={path} title={title} date={date}/>
						</li>
					))}
				</ul>
      		</section>
    	</Layout>
  	);
}

export async function getStaticProps() {
	const allPostsData = await getSortedPostsData();
	return {
		props: {
			allPostsData
		}
	};
}
