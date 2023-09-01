"use client"

import React, { useState } from 'react';
import Editor from "@/components/Editor";
import type { ChangeEvent, FormEvent, MouseEvent } from "react";
import type { PostType } from "@/types/types";
import { fetchURL } from "@/app/api/lib/fetchers";

export default function Admin() {
	const [optionSelect, setOptionSelect] = useState("newPost");
	const [newTitle, setNewTitle] = useState("");
	const [newPath, setNewPath] = useState("");
	const [image, setImage] = useState();
	const [chapters, setChapters] = useState([
		{
			chapterTitle: "",
			chapterContent: ""
		}
	]);
	
	const data = fetchURL("/api/postTypes");
	if (!data) return <div>Loading...</div>
	const allPostTypes: Array<PostType> = data.allPostTypes;

	const handleOptionSelect = (event: ChangeEvent<HTMLInputElement>) => {
		setOptionSelect(event.target.value);
	};
	const handleNewTitle = (event: ChangeEvent<HTMLInputElement>) => {
		setNewTitle(event.target.value);
		setNewPath(encodeURIComponent(event.target.value));
	};
	const handleChapterContent = (chapterContent: string, i: number) => {
		let cs = [...chapters];
		cs[i].chapterContent = chapterContent;
		setChapters(cs);
	};
	const handleAddChapter = (event: MouseEvent<HTMLInputElement>) => {
		let cs = [...chapters];
		cs.push({
			chapterTitle: "",
			chapterContent: ""
		});
		setChapters(cs);
	};
	const handleChapterTitle = (event: ChangeEvent<HTMLInputElement>, i: number) => {
		let cs = [...chapters];
		cs[i].chapterTitle = event.target.value;
		setChapters(cs);
	};
	const handleRemoveChapter = (event: MouseEvent<HTMLInputElement>, i: number) => {
		let cs = [...chapters];
		cs.splice(i, 1)
		setChapters(cs);
	};

	const handleImage = async (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			let img = event.target.files[0];
			// await setImageOfPost(img, "bonebreaker");
		}
	};

	const onSubmit = (event: FormEvent) => {
		event.preventDefault();
		console.log(event.target);
	};

    return (
        <div>
			<div className="join" onChange={handleOptionSelect}>
				<input value="newPost" defaultChecked className="join-item btn" type="radio" name="options" aria-label="New Post"/>
				<input value="editPost" className="join-item btn" type="radio" name="options" aria-label="Edit Post"/>
			</div>
			<form onSubmit={onSubmit} className={`${optionSelect==="newPost"?"block":"hidden"}`}>
				<input required name="newTitle" onChange={handleNewTitle} value={newTitle} type="text" placeholder="Title" className="input input-bordered w-full max-w-xs"/>
				<select defaultValue="" className="select select-bordered w-full max-w-xs">
					<option value="" disabled>Post type</option>
					{allPostTypes.map(({ postType, displayName }) => (
						<option value={postType} key={postType}>{displayName}</option>
					))}
				</select>
				<div className="form-control w-full max-w-xs">
					<label className="label">
						<span className="label-text">Image</span>
					</label>
					<input type="file" onChange={handleImage} accept=".jpg, .jpeg, .png" className="file-input file-input-bordered w-full max-w-xs"/>
				</div>
				<button type="submit" className="btn btn-outline btn-xs sm:btn-sm md:btn-md lg:btn-lg">Submit</button>
			</form>
			<form onSubmit={onSubmit} className={`${optionSelect==="editPost"?"block":"hidden"}`}>
				EDIT
			</form>
			<div>
				<input onClick={handleAddChapter} type="button" value="+" className="btn btn-outline" />
				{chapters.map(({ chapterTitle }, i) => (
					<div key={i}>
						<input name={`${i}`} onClick={(e) => handleRemoveChapter(e, i)} type="button" value="-" className={`btn btn-outline ${i===0?"hidden":""}`} />
						<input onChange={(e) => handleChapterTitle(e, i)} value={chapterTitle} type="text" placeholder="Title" className="input input-bordered w-full max-w-xs"/>
						<Editor setData={(chapterContent: string) => handleChapterContent(chapterContent, i)}/>
					</div>
				))}
				{chapters.map(({ chapterTitle, chapterContent }, i) => (
					<div key={i}>
						<div>{chapterTitle}</div>
						<div>{chapterContent}</div>
					</div>
				))}
			</div>
        </div>
    );
}