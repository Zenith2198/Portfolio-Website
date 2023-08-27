import { query } from './db';
import { fixDates } from './utils';
import { remark } from 'remark';
import html from 'remark-html';


export async function getSortedPostsData() {
	let allPostsData = await query({
		query: 'SELECT * FROM posts'
	});

	fixDates(allPostsData);
	
	return allPostsData.sort((a, b) => {
		if (a.date < b.date) {
			return 1;
		} else {
			return -1;
		}
	});
}

export async function getAllPaths() {
	let allPaths = await query({
		query: 'SELECT path FROM posts'
	});

	return allPaths.map((path) => {
		return {
			params: path
		}
	});
}

export async function getPostData(path) {
	let postData = await query({
		query: 'SELECT * FROM posts WHERE path=?',
		values: [path]
	});

	fixDates(postData);
	postData = postData[0]; //fixDates returns a list of elements, we only want the element we provided

	postData.content = await remark()
		.use(html)
		.process(postData.content);
	postData.content = postData.content.toString();
  
	return postData;
  }
  
