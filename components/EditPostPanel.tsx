"use client"

import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import type { PostType, Post, Chapter } from "@/types/types";
import { getURL } from "@/lib/fetchers";
import Editor from "@/components/Editor";

export default function AdminPanel({ className="" }: { className?: string }) {
	const [postType, setPostType] = useState("");
	const [post, setPost] = useState("");
	const [postObj, setPostObj] = useState();
	const [chapters, setChapters] = useState([
		{
			title: "",
			content: ""
		}
	]);

	const postTypesResponse = getURL("/api/posts/postTypes");
	const postTitlesResponse = getURL("/api/posts/postTitles");
	const postsResponse = getURL("/api/posts?sort=-dateModified");
	if (postTypesResponse.isLoading || postTitlesResponse.isLoading || postsResponse.isLoading) return <div>Loading...</div>;
  	if (postTypesResponse.error || postTitlesResponse.error || postsResponse.error) return <div>Error</div>;
	const allPostTypes: Array<PostType> = postTypesResponse.data;
	const allPostTitles: Array<{ title: string }> = postTitlesResponse.data;
	const allPosts: Array<Post> = postsResponse.data;
	
	let shortStories: Array<Post> = [];
	let longStories: Array<Post> = [];
	let blogs: Array<Post> = [];
	allPosts.forEach((post: Post) => {
		switch(post.postType) {
			case "short-stories":
				shortStories.push(post);
				break;
			case "long-stories":
				longStories.push(post);
				break;
			default:
				blogs.push(post);
		}
	});
	const allPostsObj = {
		"short-stories": shortStories,
		"long-stories": longStories,
		blogs
	}

	const handlePostType = (event: ChangeEvent<HTMLSelectElement>) => {
		setPostType(event.target.value);

		setPost("");
		setPostObj(undefined);
		setChapters([
			{
				title: "",
				content: ""
			}
		]);
	};

	const handlePost = async (event: ChangeEvent<HTMLSelectElement>) => {
		setPost(event.target.value);

		const postDataRes = await fetch(`${process.env.PUBLIC_URL_DEV}/api/posts/${event.target.value}?chapters=true`);
		const postData = await postDataRes.json();
		setPostObj(postData);
		setChapters(postData.chapters.map((chapter: Chapter) => {
			return {
				title: chapter.title,
				content: chapter.content
			}
		}))
	};

	const handleTitle = (event: ChangeEvent<HTMLInputElement>) => {
		const titleMatchArr = allPostTitles.filter((str) => event.target.value?.toLowerCase() === str.title.toLowerCase());
		const titleError = document.getElementById("editTitleError");
		if (titleMatchArr.length !== 0) {
			if (!event.target.className.includes(" input-error")) {
				if (titleError) {
					titleError.className = titleError.className.replace(" hidden", "");
				}
				event.target.className += " input-error";
			}
		} else {
			if (titleError && !titleError.className.includes(" hidden")) {
				titleError.className += " hidden";
			}
			event.target.className = event.target.className.replace(" input-error", "");
		}
	};

	const handleChapterTitle = (event: ChangeEvent<HTMLInputElement>, i: number) => {
		let cs = [...chapters];
		cs[i].title = event.target.value;
		setChapters(cs);
	};
	const handleChapterContent = (chapterContent: string, i: number) => {
		let cs = [...chapters];
		cs[i].content = chapterContent;
		setChapters(cs);
	};
	const handleAddChapter = () => {
		let cs = [...chapters];
		cs.push({
			title: "",
			content: ""
		});
		setChapters(cs);
	};
	const handleRemoveChapter = () => {
		let cs = [...chapters];
		cs.pop();
		setChapters(cs);
	};

	const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const titleError = document.getElementById("editTitleError");
		if (titleError && !titleError.className.includes(" hidden")) {
			titleError.scrollIntoView({ behavior: "smooth" });
			return false;
		}
	};

	return (
		<div>
			<form onSubmit={onSubmit} autoComplete="off" className={`${className}`}>
				<div className="form-control w-full max-w-xs">
					<label className="label">
						<span className="label-text">Post Type</span>
					</label>
					<select name="postType" value={postType} onChange={handlePostType} required className="select select-bordered w-full max-w-xs">
						<option value="" disabled>Select post type</option>
						{allPostTypes.map(({ postType, displayName }) => (
							<option value={postType} key={postType}>{displayName}</option>
						))}
					</select>
					<label className="label">
						<span></span>
						<span className="label-text-alt">Required</span>
					</label>
				</div>
				{postType ? 
					<div className="form-control w-full max-w-xs">
						<label className="label">
							<span className="label-text">Posts</span>
						</label>
						<select name="posts" value={post} onChange={handlePost} required className="select select-bordered w-full max-w-xs">
							<option value="" disabled>Select post</option>
							{/* @ts-ignore */}
							{allPostsObj[postType].map(({ title, path }) => (
								<option value={path} key={path}>{title}</option>
							))}
						</select>
						<label className="label">
							<span></span>
							<span className="label-text-alt">Required</span>
						</label>
						{postObj ? 
							<div>
								<div className="form-control w-full max-w-xs">
									<label className="label">
										<span className="label-text">Post Title</span>
										<span id="editTitleError" className="label-text-alt hidden">Title already exists</span>
									</label>
									{/* TODO: only apply success borders when field has been changed */}
									<input name="title" onChange={handleTitle} type="text" placeholder="Enter post title" className="input input-bordered input-success w-full max-w-xs"/>
								</div>
								<div>
									<input onClick={handleAddChapter} type="button" value="+" className="btn btn-outline" />
									{/* @ts-ignore */}
									<input onClick={()=>document.getElementById("editRemoveChapterModal").showModal()} type="button" value="-" className={`btn btn-outline ${chapters.length===1?"hidden":""}`} />
									{chapters.map(({ title: chapterTitle }, i) => (
										<div key={i}>
											<label className="label">
												<span className="label-text">Chapter Title</span>
											</label>
											{/* TODO: only apply success borders when field has been changed */}
											<input onChange={(e) => handleChapterTitle(e, i)} value={chapterTitle} type="text" placeholder="Title" className="input input-bordered input-success w-full max-w-xs"/>
											<Editor className="textarea-success" setData={(chapterContent: string) => handleChapterContent(chapterContent, i)}/>
										</div>
									))}
								</div>
							</div>
							:
							<div></div>
						}
					</div>
					:
					<div></div>
				}
			</form>
			<dialog id="editRemoveChapterModal" className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-lg">Remove chapter</h3>
					<p className="py-4">Are you sure you want to remove the last chapter? You will lose all content in that chapter.</p>
					<form method="dialog">
						<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
						<button onClick={handleRemoveChapter} className="btn">Confirm</button>
					</form>
				</div>
				<form method="dialog" className="modal-backdrop">
					<button>close</button>
				</form>
			</dialog>
		</div>
	);
}