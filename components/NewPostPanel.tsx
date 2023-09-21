"use client"

import React, { useState } from 'react';
import Editor from "@/components/Editor";
import type { ChangeEvent, FormEvent, MouseEvent } from "react";
import type { PostType } from "@/types/types";
import { getURL } from "@/lib/fetchers";

export default function AdminPanel({ className="" }: { className?: string }) {
	const [postResponse, setPostResponse] = useState("");
	const [chapters, setChapters] = useState([
		{
			title: "",
			content: ""
		}
	]);
	
	const postTypesResponse = getURL("/api/posts/postTypes");
	const postTitlesResponse = getURL("/api/posts/postTitles");
	if (postTypesResponse.isLoading || postTitlesResponse.isLoading) return <div>Loading...</div>;
  	if (postTypesResponse.error || postTitlesResponse.error) return <div>Error</div>;
	const allPostTypes: Array<PostType> = postTypesResponse.data;
	let allPostTitles: Array<{ title: string }> = postTitlesResponse.data;

	const handleTitle = (event: ChangeEvent<HTMLInputElement>) => {
		const titleMatchArr = allPostTitles.filter((str) => event.target.value?.toLowerCase() === str.title.toLowerCase());
		const titleError = document.getElementById("titleError");
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

		const titleError = document.getElementById("newTitleError");
		if (titleError && !titleError.className.includes(" hidden")) {
			titleError.scrollIntoView({ behavior: "smooth" });
			return false;
		}

		const newLoadingModal = document.getElementById("newLoadingModal") as HTMLInputElement;
		if (newLoadingModal) {
			newLoadingModal.checked = true;
		}
		let formData = new FormData(event.currentTarget);
		//@ts-ignore
		if (formData.get("image").size === 0) {
			formData.delete("image");
		}
		formData.append("chapters", JSON.stringify(chapters));

		const res = await fetch(`${process.env.PUBLIC_URL_DEV}/api/posts/admin/newEditPost`, {
			method: "POST",
			body: formData
		}).then((res) => res.json());
		if (res.response === "success") {
			setPostResponse(res.response);
			//@ts-ignore
		}
	};

	return (
		<div>
			<form onSubmit={onSubmit} autoComplete="off" className={`${className}`}>
				<div className="form-control w-full max-w-xs">
					<label className="label">
						<span className="label-text">Post Type</span>
					</label>
					<select name="postType" required defaultValue="" className="select select-bordered w-full max-w-xs">
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
				<div className="form-control w-full max-w-xs">
					<label className="label">
						<span className="label-text">Post Title</span>
						<span id="newTitleError" className="label-text-alt hidden">Title already exists</span>
					</label>
					<input required name="title" onChange={handleTitle} type="text" placeholder="Enter post title" className="input input-bordered w-full max-w-xs"/>
					<label className="label">
						<span></span>
						<span className="label-text-alt">Required</span>
					</label>
				</div>
				<div className="form-control w-full max-w-xs">
					<label className="label">
						<span className="label-text">Image</span>
					</label>
					<input type="file" name="image" accept=".jpg, .jpeg, .png" className="file-input file-input-bordered w-full max-w-xs"/>
				</div>
				<div className="form-control">
					<span className="label-text">Primary Story?</span> 
					<input type="checkbox" name="primaryStory" value="1" className="checkbox" />
				</div>
				<div className="form-control">
					<span className="label-text">WIP</span> 
					<input type="checkbox" name="wip" value="1" className="checkbox" />
				</div>
				<button type="submit" className="btn btn-outline">Submit</button>
				<div>
					<input onClick={handleAddChapter} type="button" value="+" className="btn btn-outline" />
					{/* @ts-ignore */}
					<input onClick={()=>document.getElementById("newRemoveChapterModal").showModal()} type="button" value="-" className={`btn btn-outline ${chapters.length===1?"hidden":""}`} />
					{chapters.map(({ title: chapterTitle }, i) => (
						<div key={i}>
							<label className="label">
								<span className="label-text">Chapter Title</span>
							</label>
							<input onChange={(e) => handleChapterTitle(e, i)} value={chapterTitle} type="text" placeholder="Title" className="input input-bordered w-full max-w-xs"/>
							<Editor setData={(chapterContent: string) => handleChapterContent(chapterContent, i)}/>
						</div>
					))}
				</div>
			</form>
			<dialog id="newRemoveChapterModal" className="modal">
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
			<input type="checkbox" id="newLoadingModal" className="modal-toggle" />
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
									<label htmlFor="newLoadingModal" onClick={() => window.location.href = window.location.href} className="btn">Close</label>
								</div>
							</div>
							:
							<div></div>
						}
					</div>
				}
			</div>
		</div>
	);
}