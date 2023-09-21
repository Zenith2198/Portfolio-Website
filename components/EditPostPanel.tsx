"use client"

import { useState, useEffect } from "react";
import type { FormEvent, ChangeEvent, MouseEvent } from "react";
import type { PostType, Post, Chapter } from "@/types/types";
import { getURL } from "@/lib/fetchers";
import Editor from "@/components/Editor";

export default function AdminPanel({ className="" }: { className?: string }) {
	//setting up useStates and useEffects
	const [postType, setPostType] = useState("");
	const [path, setPath] = useState("");
	const [title, setTitle] = useState("");
	const [prevPost, setPrevPost] = useState({} as Post);
	useEffect(() => {
		const primaryStory = document.getElementById("editPrimaryStory");
		if (primaryStory) {
			//@ts-ignore
			primaryStory.checked = !!prevPost.primaryStory;
		}

		const wip = document.getElementById("editWIP");
		if (wip) {
			//@ts-ignore
			wip.checked = !!prevPost.wip;
		}

		setChapters([]);
	}, [prevPost]);
	const [chapters, setChapters] = useState([
		{
			title: "",
			content: ""
		}
	]);
	useEffect(() => {
		if (chapters.length === 0 && prevPost.chapters && prevPost.chapters.length !== 0) {
			setChapters(prevPost.chapters.map((chapter: Chapter) => {
				return {
					title: chapter.title,
					content: chapter.content
				}
			}));
		}
	}, [chapters]);
	useEffect(() => {
		if (chapters.length !== 0) {
			//set the chapters container border to green if there is a different number of chapters
			const chaptersContainer = document.getElementById("editChaptersContainer");
			if (prevPost.chapters && chapters.length !== prevPost.chapters.length) {
				if (chaptersContainer && !chaptersContainer.className.includes(" input-success")) {
					chaptersContainer.className += " input-success";
				}
			} else {
				if (chaptersContainer) {
					chaptersContainer.className = chaptersContainer.className.replace(" input-success", "");
				}
			}

			//set the chapter border to green if it is a new chapter
			const chapter = document.getElementById(`editChapter${chapters.length-1}`);
			if (prevPost.chapters && chapters.length > prevPost.chapters.length) {
				if (chapter && !chapter.className.includes(" input-success")) {
					chapter.className += " input-success";
				}
			} else {
				if (chapter) {
					chapter.className = chapter.className.replace(" input-success", "");
				}
			}
		}
	}, [chapters[chapters.length-1]]);

	//making GET requests
	const postTypesResponse = getURL("/api/posts/postTypes");
	const postTitlesResponse = getURL("/api/posts/postTitles");
	const postsResponse = getURL("/api/posts?sort=-dateModified");
	if (postTypesResponse.isLoading || postTitlesResponse.isLoading || postsResponse.isLoading) return <div>Loading...</div>;
  	if (postTypesResponse.error || postTitlesResponse.error || postsResponse.error) return <div>Error</div>;
	const allPostTypes: Array<PostType> = postTypesResponse.data;
	const allPostTitles: Array<{ title: string }> = postTitlesResponse.data;
	const allPosts: Array<Post> = postsResponse.data;
	
	//assembling object to hold all posts sorted by postType
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

	//onChange handlers
	const handlePostType = (event: ChangeEvent<HTMLSelectElement>) => {
		setPostType(event.target.value);

		setPath("");
		setTitle("");
		setPrevPost({} as Post);
		const image = document.getElementById("editImage");
		if (image) {
			image.className = image.className.replace(" input-success", "");
			//@ts-ignore
			image.value = null;
		}
		setChapters([]);
		const primaryStory = document.getElementById("editPrimaryStory");
		if (primaryStory) {
			//@ts-ignore
			primaryStory.checked = false;
		}
		const wip = document.getElementById("editWIP");
		if (wip) {
			//@ts-ignore
			wip.checked = false;
		}
	};

	const handlePost = async (event: ChangeEvent<HTMLSelectElement>) => {
		setPath(event.target.value);

		const postDataRes = await fetch(`${process.env.PUBLIC_URL_DEV}/api/posts/${event.target.value}?chapters=true`);
		const postData = await postDataRes.json();
		setTitle(postData.title);
		setPrevPost(postData);
		const image = document.getElementById("editImage");
		if (image) {
			image.className = image.className.replace(" input-success", "");
			//@ts-ignore
			image.value = null;
		}
	};

	const handleTitle = (event: ChangeEvent<HTMLInputElement>) => {
		setTitle(event.target.value);

		//set the title border to green if it has been changed, or red if it already exists
		const titleMatchArr = allPostTitles.filter((str) => event.target.value?.toLowerCase() === str.title.toLowerCase());
		const titleError = document.getElementById("editTitleError");
		if (titleMatchArr.length !== 0 && event.target.value !== prevPost.title) {
			if (!event.target.className.includes(" input-error")) {
				if (titleError) {
					titleError.className = titleError.className.replace(" hidden", "");
				}
				event.target.className += " input-error";
			}
			event.target.className = event.target.className.replace(" input-success", "");
		} else {
			if (titleError && !titleError.className.includes(" hidden")) {
				titleError.className += " hidden";
			}
			event.target.className = event.target.className.replace(" input-error", "");

			if (event.target.value !== "" && event.target.value !== prevPost.title) {
				if (!event.target.className.includes(" input-success")) {
					event.target.className += " input-success";
				}
			} else {
				event.target.className = event.target.className.replace(" input-success", "");
			}
		}
	};

	const handleImage = (event: ChangeEvent<HTMLInputElement>) => {
		//set the image border to green if an image has been selected
		event.target.className += " input-success";
	};

	const handlePrimaryStory = (event: ChangeEvent<HTMLInputElement>) => {
		//set the primary story border to green if it has been changed
		if (event.target.checked != !!prevPost.primaryStory) {
			if (!event.target.className.includes(" checkbox-success")) {
				event.target.className += " checkbox-success";
			}
		} else {
			event.target.className = event.target.className.replace(" checkbox-success", "");
		}
	};

	const handleWIP = (event: ChangeEvent<HTMLInputElement>) => {
		//set the wip border to green if it has been changed
		if (event.target.checked != !!prevPost.wip) {
			if (!event.target.className.includes(" checkbox-success")) {
				event.target.className += " checkbox-success";
			}
		} else {
			event.target.className = event.target.className.replace(" checkbox-success", "");
		}
	};

	const handleRemoveChapter = () => {
		let cs = [...chapters];
		cs.pop();
		setChapters(cs);

	};
	const handleAddChapter = async () => {
		let cs = [...chapters];
		cs.push({
			title: "",
			content: ""
		});
		setChapters(cs);
	};
	const handleChapterTitle = (event: ChangeEvent<HTMLInputElement>, i: number) => {
		let cs = [...chapters];
		cs[i].title = event.target.value;
		setChapters(cs);

		//set the chapter title border to green if it has been changed
		if (prevPost.chapters[i] && event.target.value !== prevPost.chapters[i].title) {
			if (!event.target.className.includes(" input-success")) {
				event.target.className += " input-success";
			}
		} else {
			event.target.className = event.target.className.replace(" input-success", "");
		}
	};
	const handleChapterContent = (chapterContent: string, i: number) => {
		let cs = [...chapters];
		cs[i].content = chapterContent;
		setChapters(cs);

		//set the chapter content border to green if it has been changed
		const chapterEditor = document.getElementById(`editChapterEditor${i}`);
		if (prevPost.chapters[i] && chapterContent !== prevPost.chapters[i].content) {
			if (chapterEditor && !chapterEditor.className.includes(" textarea-success")) {
				chapterEditor.className += " textarea-success";
			}
		} else {
			if (chapterEditor) {
				chapterEditor.className = chapterEditor.className.replace(" textarea-success", "");
			}
		}
	};

	//onClick handler for delete button
	const handleDelete = async (event: MouseEvent<HTMLButtonElement>) => {
		//TODO: show loading
		const response = await fetch(`${process.env.PUBLIC_URL_DEV}/api/posts/admin/deletePost`, {
			method: "POST",
			body: JSON.stringify({path: path})
		}).then((res) => res.json());
		//TODO: refresh UI
	};

	//onSubmit handler
	const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const titleError = document.getElementById("editTitleError");
		if (titleError && !titleError.className.includes(" hidden")) {
			titleError.scrollIntoView({ behavior: "smooth" });
			return false;
		}
		
		//TODO: return false if nothing has been changed

		//TODO: show loading
		let formData = new FormData(event.currentTarget);
		//@ts-ignore
		if (formData.get("image").size === 0) {
			formData.delete("image");
		}
		formData.append("chapters", JSON.stringify(chapters));
		formData.append("edit", "true");

		const response = await fetch(`${process.env.PUBLIC_URL_DEV}/api/posts/admin/newEditPost`, {
			method: "POST",
			body: formData
		}).then((res) => res.json());
		//TODO: refresh UI
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
						<select name="posts" value={path} onChange={handlePost} required className="select select-bordered w-full max-w-xs">
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
						{Object.keys(prevPost).length !== 0 ? 
							<div>
								{/* @ts-ignore */}
								<input onClick={()=>document.getElementById("editDeleteModal").showModal()} type="button" value="Delete" className="btn btn-outline btn-error"/>
								<div className="form-control w-full max-w-xs">
									<label className="label">
										<span className="label-text">Post Title</span>
										<span id="editTitleError" className="label-text-alt hidden">Title already exists</span>
									</label>
									<input name="title" required onChange={handleTitle} value={title} type="text" placeholder="Enter post title" className="input input-bordered w-full max-w-xs"/>
								</div>
								<div className="form-control w-full max-w-xs">
									<label className="label">
										<span className="label-text">Image</span>
									</label>
									<input id="editImage" onChange={handleImage} type="file" name="image" accept=".jpg, .jpeg, .png" className="file-input file-input-bordered w-full max-w-xs"/>
								</div>
								<div className="form-control">
									<span className="label-text">Primary Story?</span> 
									<input id="editPrimaryStory" onChange={handlePrimaryStory} type="checkbox" name="primaryStory" value="1" className="checkbox" />
								</div>
								<div className="form-control">
									<span className="label-text">WIP</span> 
									<input id="editWIP" onChange={handleWIP} type="checkbox" name="wip" value="1" className="checkbox" />
								</div>
								<button type="submit" className="btn btn-outline">Submit</button>
								<div id="editChaptersContainer" className="textarea">
									<input onClick={handleAddChapter} type="button" value="+" className="btn btn-outline" />
									{/* @ts-ignore */}
									<input onClick={()=>document.getElementById("editRemoveChapterModal").showModal()} type="button" value="-" className={`btn btn-outline ${chapters.length===1?"hidden":""}`} />
									{chapters.map(({ title: chapterTitle }, i) => (
										<div id={`editChapter${i}`} key={i} className="textarea">
											<label className="label">
												<span className="label-text">Chapter Title</span>
											</label>
											<input onChange={(e) => handleChapterTitle(e, i)} value={chapterTitle} type="text" placeholder="Title" className="input input-bordered w-full max-w-xs"/>
											<Editor id={`editChapterEditor${i}`} data={chapters[i].content} setData={(chapterContent: string) => handleChapterContent(chapterContent, i)}/>
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
					<h3 className="font-bold text-lg">Remove Chapter</h3>
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
			<dialog id="editDeleteModal" className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-lg">Delete Pose</h3>
					<p className="py-4">Are you sure you want to delete this post?</p>
					<form method="dialog">
						<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
						<button onClick={handleDelete} className="btn">Confirm</button>
					</form>
				</div>
				<form method="dialog" className="modal-backdrop">
					<button>close</button>
				</form>
			</dialog>
		</div>
	);
}