"use client"

import { useState, useEffect } from "react";
import type { FormEvent, ChangeEvent, MouseEvent } from "react";
import type { PostType, Post } from "@prisma/client";
import type { PostWithChapters } from "@/types/types.d";
import useSWR from "swr";
import { getBaseUrl, fetcher, isEmpty, buildURLParams } from "@/lib/utils";
import Editor from "@/components/Editor";

export default function AdminPanel({ className="" }: { className?: string }) {
	//setting up useStates
	const [postTypeId, setPostTypeId] = useState("");
	const [path, setPath] = useState("");
	const [title, setTitle] = useState("");
	const [chapters, setChapters] = useState([
		{
			title: "",
			content: ""
		}
	]);
	const [editedFields, setEditedFields] = useState({
		title: false,
		image: false,
		primaryStory: false,
		wip: false
	});
	const [chaptersIsEdited, setChaptersIsEdited] = useState(false);
	const [editedChapters, setEditedChapters] = useState([
		{
			edited: false,
			title: false,
			content: false
		}
	]);
	const [postResponse, setPostResponse] = useState("");
	const [prevPost, setPrevPost] = useState({} as PostWithChapters);

	//setting up useEffects
	useEffect(() => {
		const primaryStory = document.getElementById("editPrimaryStory")  as HTMLInputElement;
		if (primaryStory) {
			primaryStory.checked = !!prevPost.primaryStory;
		}

		const wip = document.getElementById("editWIP")  as HTMLInputElement;
		if (wip) {
			wip.checked = !!prevPost.wip;
		}

		setChapters([]);
	}, [prevPost]);
	useEffect(() => {
		if (chapters.length === 0 && prevPost.chapters && prevPost.chapters.length !== 0) {
			let tempChapters = [];
			let chapters = [] as Array<{ edited: boolean, title: boolean, content: boolean }>;

			for (const chapter of prevPost.chapters) {
				tempChapters.push({
					title: chapter.title ? chapter.title : "",
					content: chapter.content ? chapter.content : ""
				});

				chapters.push({
					edited: false,
					title: false,
					content: false
				})
			}
			setChapters(tempChapters);
			setEditedChapters(chapters);
		}
	}, [chapters]);
	useEffect(() => {
		setChaptersIsEdited((prevPost.chapters && editedChapters.length !== prevPost.chapters.length) || isEdited(editedChapters));
	}, [editedChapters]);

	//making GET requests
	const postTypesResponse = useSWR(`${getBaseUrl()}/api/postTypes`, fetcher);
	const postsParams = buildURLParams({
		fields: [{ fieldKey: "title" }, { fieldKey: "path" }, { fieldKey: "postTypeId" }],
		sort: [{ sortKey: "dateModified", desc: true }]
	});
	const postsResponse = useSWR(`${getBaseUrl()}/api/posts${postsParams}`, fetcher);
	if (postTypesResponse.isLoading || postsResponse.isLoading) return <div>Loading...</div>;
  	if (postTypesResponse.error || postsResponse.error) return <div>Error</div>;
	const allPostTypes: Array<PostType> = postTypesResponse.data;
	const allPosts: Array<Post> = postsResponse.data;
	
	//assembling object to hold all posts sorted by postTypeId
	let shortStories: Array<Post> = [];
	let longStories: Array<Post> = [];
	let blogs: Array<Post> = [];
	allPosts.forEach((post: Post) => {
		switch(post.postTypeId) {
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
	function handlePostType(event: ChangeEvent<HTMLSelectElement>) {
		setPostTypeId(event.target.value);

		setPath("");
		setTitle("");
		setPostResponse("");
		setPrevPost({} as PostWithChapters);
	}

	async function handlePost(event: ChangeEvent<HTMLSelectElement>) {
		setPath(event.target.value);

		const postDataRes = await fetch(`${getBaseUrl()}/api/posts/${event.target.value}?chapters=true`); //possible anti-pattern?
		if (!postDataRes.ok) throw new Error("Failed to fetch data");
		const postData = await postDataRes.json();
		setTitle(postData.title);
		setPrevPost(postData);

		const image = document.getElementById("editImage") as HTMLInputElement;
		if (image) {
			image.value = "";
		}
	}

	function handleTitle(event: ChangeEvent<HTMLInputElement>) {
		setTitle(event.target.value);

		//set the title border to green if it has been edited, or red if it already exists
		const titleMatchArr = allPosts.filter((post) => event.target.value?.toLowerCase() === post.title.toLowerCase());
		const titleError = document.getElementById("editTitleError");
		if (titleError) {
			if (titleMatchArr.length !== 0) {
				if (event.target.value === prevPost.title) {
					titleError.innerHTML = "Title is the same as previous";
				} else {
					titleError.innerHTML = "Title already exists";
				}
				if (!event.target.className.includes(" input-error")) {
					titleError.className = titleError.className.replace(" hidden", "");
					event.target.className += " input-error";
				}
				setEditedFields({
					...editedFields,
					title: false
				});
			} else {
				if (!titleError.className.includes(" hidden")) {
					titleError.className += " hidden";
				}
				event.target.className = event.target.className.replace(" input-error", "");

				if (event.target.value !== "" && event.target.value !== prevPost.title) {
					setEditedFields({
						...editedFields,
						title: true
					});
				} else {
					setEditedFields({
						...editedFields,
						title: false
					});
				}
			}
		}
	}

	function handleImage(event: ChangeEvent<HTMLInputElement>) {
		if (event.target.files) {
		}
		//set the image border to green if an image has been selected
		setEditedFields({
			...editedFields,
			image: true
		});
	}

	function handlePrimaryStory(event: ChangeEvent<HTMLInputElement>) {
		//set the primary story border to green if it has been edited
		if (event.target.checked != !!prevPost.primaryStory) {
			setEditedFields({
				...editedFields,
				primaryStory: true
			});
		} else {
			setEditedFields({
				...editedFields,
				primaryStory: false
			});
		}
	}

	function handleWIP(event: ChangeEvent<HTMLInputElement>) {
		//set the wip border to green if it has been edited
		if (event.target.checked != !!prevPost.wip) {
			setEditedFields({
				...editedFields,
				wip: true
			});
		} else {
			setEditedFields({
				...editedFields,
				wip: false
			});
		}
	};

	function handleRemoveChapter() {
		let cs = [...chapters];
		cs.pop();
		setChapters(cs);

		let tempChapters = [...editedChapters];
		tempChapters.pop();
		setEditedChapters(tempChapters);
	};
	async function handleAddChapter() {
		let cs = [...chapters];
		cs.push({
			title: "",
			content: ""
		});
		setChapters(cs);

		let tempChapters = [...editedChapters];
		const title = !!(prevPost.chapters[tempChapters.length] && prevPost.chapters[tempChapters.length].title !== "");
		const content = !!(prevPost.chapters[tempChapters.length] && prevPost.chapters[tempChapters.length].content !== "");
		tempChapters.push({
			edited: !prevPost.chapters[tempChapters.length] || title || content,
			title,
			content
		});
		setEditedChapters(tempChapters);
	}
	function handleChapterTitle(event: ChangeEvent<HTMLInputElement>, i: number) {
		let cs = [...chapters];
		cs[i].title = event.target.value;
		setChapters(cs);

		//set the chapter title border to green if it has been edited
		let tempChapters = [...editedChapters];
		if (prevPost.chapters[i] && event.target.value !== prevPost.chapters[i].title) {
			tempChapters[i] = {
				edited: true,
				title: true,
				content: tempChapters[i].content
			}
		} else {
			tempChapters[i] = {
				edited: !(prevPost.chapters[i]) || tempChapters[i].content,
				title: false,
				content: tempChapters[i].content,
			}
		}
		setEditedChapters(tempChapters);
	}
	function handleChapterContent(chapterContent: string, i: number) {
		let cs = [...chapters];
		cs[i].content = chapterContent;
		setChapters(cs);

		//set the chapter content border to green if it has been edited
		let tempChapters = [...editedChapters];
		if (prevPost.chapters[i] && chapterContent !== prevPost.chapters[i].content) {
			tempChapters[i] = {
				edited: true,
				title: tempChapters[i].title,
				content: true
			}
		} else {
			tempChapters[i] = {
				edited: !(prevPost.chapters[i]) || tempChapters[i].title,
				title: tempChapters[i].title,
				content: false
			}
		}
		setEditedChapters(tempChapters);
	}

	//check if nothing has been edited
	function isEdited(obj: Object) {
		for (const v of Object.values(obj)) {
			if (v === true || v.edited === true) {
				return true;
			} else if (typeof v === "object") {
				if (isEdited(v)) {
					return true;
				}
			} else if (v.constructor === Array) {
				for (const o of v) {
					if (isEdited(o)) {
						return true;
					}
				}
			}
		}
		return false;
	}

	function getEditedForm() {
		let formData = new FormData();
		formData.append("oldTitle", prevPost.title);

		if (editedFields.title) {
			formData.append("title", title);
		}
		if (editedFields.image) {
			const image = document.getElementById("editImage") as HTMLInputElement;
			if (image.files) {
				formData.append("image", image.files[0])
			}
		}
		if (editedFields.primaryStory) {
			const primaryStory = document.getElementById("editPrimaryStory")  as HTMLInputElement;
			if (primaryStory) {
				formData.append("primaryStory", JSON.stringify(primaryStory.checked));
			}
		}
		if (editedFields.wip) {
			const wip = document.getElementById("editWIP")  as HTMLInputElement;
			if (wip) {
				formData.append("wip", JSON.stringify(wip.checked));
			}
		}

		if (chaptersIsEdited) {
			let editedChaptersObj = {} as Record<string, number | { title: string, content: string }>;

			if (chapters.length < prevPost.chapters.length) {
				formData.append("chaptersDeleted", JSON.stringify(Array.from(
					{ length: prevPost.chapters.length - chapters.length },
					(v, i) => chapters.length + i + 1
				))); //creates list of numbers starting from chapters.length and ending at prevPost.chapters.length
			}

			editedChapters.forEach((v, i) => {
				if (v.edited) {
					let chapter = {} as { title: string, content: string };
					if (i > prevPost.chapters.length - 1) {
						chapter.title = chapters[i].title;
						chapter.content = chapters[i].content;
					} else {
						if (v.title) {
							chapter.title = chapters[i].title;
						}
						if (v.content) {
							chapter.content = chapters[i].content;
						}
					}
					editedChaptersObj[i] = chapter;
				}
			});
			formData.append("chapters", JSON.stringify(editedChaptersObj))
		}

		return formData;
	}

	//onClick handler for delete button
	async function handleDelete() {
		const editLoadingModal = document.getElementById("editLoadingModal") as HTMLInputElement;
		if (editLoadingModal) {
			editLoadingModal.checked = true;
		}
		const deleteRes = await fetch(`${getBaseUrl()}/api/admin/deletePost`, {
			method: "POST",
			body: JSON.stringify({path: path})
		});
		if (!deleteRes.ok) return;
		const res = await deleteRes.json();
		if (res.response === "success") {
			setPostResponse(res.response);
		}
	}

	//onSubmit handler
	async function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const titleError = document.getElementById("editTitleError");
		if (titleError && !titleError.className.includes(" hidden")) {
			titleError.scrollIntoView({ behavior: "smooth" });
			return false;
		}

		if (!isEdited(editedFields) && !chaptersIsEdited) {
			window.scrollTo({ top: 0, behavior: 'smooth' });
			return false;
		}

		const editLoadingModal = document.getElementById("editLoadingModal") as HTMLInputElement;
		if (editLoadingModal) {
			editLoadingModal.checked = true;
		}
		const submitRes = await fetch(`${getBaseUrl()}/api/admin/editPost`, {
			method: "POST",
			body: getEditedForm()
		});
		if (!submitRes.ok) return false;
		const res = await submitRes.json();
		if (res.response === "success") {
			setPostResponse(res.response);
		}
	}

	return (
		<div>
			<form onSubmit={onSubmit} autoComplete="off" className={`${className}`}>
				<div className="form-control w-full max-w-xs">
					<label className="label">
						<span className="label-text">Post Type</span>
					</label>
					<select name="postTypeId" value={postTypeId} onChange={handlePostType} required className="select select-bordered w-full max-w-xs">
						<option value="" disabled>Select post type</option>
						{allPostTypes.map(({ postTypeId, displayName }) => (
							<option value={postTypeId} key={postTypeId}>{displayName}</option>
						))}
					</select>
					<label className="label">
						<span></span>
						<span className="label-text-alt">Required</span>
					</label>
				</div>
				{postTypeId ?
					<div className="form-control w-full max-w-xs">
						<label className="label">
							<span className="label-text">Posts</span>
						</label>
						<select name="posts" value={path} onChange={handlePost} required className="select select-bordered w-full max-w-xs">
							<option value="" disabled>Select post</option>
							{/* @ts-ignore */}
							{allPostsObj[postTypeId].map(({ title, path }) => (
								<option value={path} key={path}>{title}</option>
							))}
						</select>
						<label className="label">
							<span></span>
							<span className="label-text-alt">Required</span>
						</label>
						{!isEmpty(prevPost) ? 
							<div>
								{/* @ts-ignore */}
								<input onClick={()=>document.getElementById("editDeleteModal").showModal()} type="button" value="Delete" className="btn btn-outline btn-error"/>
								<div className="form-control w-full max-w-xs">
									<label className="label">
										<span className="label-text">Post Title</span>
										<span id="editTitleError" className="label-text-alt hidden"></span>
									</label>
									<input name="title" required onChange={handleTitle} value={title} type="text" placeholder="Enter post title" className={`${editedFields.title ? "input-success" : ""} input input-bordered w-full max-w-xs`}/>
								</div>
								<div className="form-control w-full max-w-xs">
									<label className="label">
										<span className="label-text">Image</span>
									</label>
									<input id="editImage" onChange={handleImage} type="file" name="image" accept=".jpg, .jpeg, .png" className={`${editedFields.image ? "input-success" : ""} file-input file-input-bordered w-full max-w-xs`}/>
								</div>
								<div className="form-control">
									<span className="label-text">Primary Story?</span> 
									<input id="editPrimaryStory" value="true" onChange={handlePrimaryStory} type="checkbox" name="primaryStory" className={`${editedFields.primaryStory ? "checkbox-success" : ""} checkbox`} />
								</div>
								<div className="form-control">
									<span className="label-text">WIP</span> 
									<input id="editWIP" value="true" onChange={handleWIP} type="checkbox" name="wip" className={`${editedFields.wip ? "checkbox-success" : ""} checkbox`} />
								</div>
								<button type="submit" className="btn btn-outline">Submit</button>
								<div className={`${chaptersIsEdited ? "textarea-success" : ""} textarea`}>
									{postTypeId === "blogs" ? <div></div> :
										<div>
											<input onClick={handleAddChapter} type="button" value="+" className="btn btn-outline" />
											{/* @ts-ignore */}
											<input onClick={()=>document.getElementById("editRemoveChapterModal").showModal()} type="button" value="-" className={`btn btn-outline ${chapters.length===1?"hidden":""}`} />
										</div>
									}
									{chapters.map(({ title: chapterTitle }, i) => (
										<div key={i} className={`${editedChapters[i].edited ? "input-success" : ""} textarea`}>
											{postTypeId === "blogs" ? <div></div> :
												<div>
													<label className="label">
														<span className="label-text">Chapter Title</span>
													</label>
													<input onChange={(e) => handleChapterTitle(e, i)} value={chapterTitle} type="text" placeholder="Title" className={`${editedChapters[i].title ? "input-success" : ""} input input-bordered w-full max-w-xs`}/>
												</div>
											}
											<Editor data={chapters[i].content} setData={(chapterContent: string) => handleChapterContent(chapterContent, i)} className={`${editedChapters[i].content ? "textarea-success" : ""} textarea`}/>
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
			<input type="checkbox" id="editLoadingModal" className="modal-toggle" />
			<div className="modal">
				{!postResponse ?
					<div className="modal-box p-0 w-min h-min bg-transparent">
						<span className="loading loading-spinner loading-lg"></span>
					</div>
					:
					<div className="modal-box">
						{postResponse === "success" ?
							<div>
								<h3 className="font-bold text-lg">Success</h3>
								<div className="modal-action">
									<label htmlFor="editLoadingModal" onClick={postsResponse.mutate} className="btn">Close</label>
								</div>
							</div>
							:
							<div>
								<h3 className="font-bold text-lg">Error</h3>
								<div className="modal-action">
									<label htmlFor="editLoadingModal" className="btn">Close</label>
								</div>
							</div>
						}
					</div>
				}
			</div>
		</div>
	);
}