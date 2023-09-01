"use client"

import React, { useState } from 'react';
import Editor from "@/components/editor";
import type { ChangeEvent, FormEvent } from "react";
import type { PostType } from "@/types/types";

export default function Admin({ allPostTypes }: { allPostTypes:Array<PostType> }) {
	const [editorData, setEditorData] = useState("");
	const [optionSelect, setOptionSelect] = useState("newPost");
	const handleOptionSelect = (event: ChangeEvent<HTMLInputElement>) => {
		setOptionSelect(event.target.value);
	};
	const [newTitle, setNewTitle] = useState("");
	const [newPath, setNewPath] = useState("");
	const handleNewTitle = (event: ChangeEvent<HTMLInputElement>) => {
		setNewTitle(event.target.value);
		setNewPath(encodeURIComponent(event.target.value));
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
					<input type="file" className="file-input file-input-bordered w-full max-w-xs" />
				</div>
				<button type="submit" className="btn btn-outline btn-xs sm:btn-sm md:btn-md lg:btn-lg">Submit</button>
			</form>
			<form onSubmit={onSubmit} className={`${optionSelect==="editPost"?"block":"hidden"}`}>
				EDIT
			</form>
			GOTTA ALLOW EXTRA EDITORS TO BE ADDED FOR EACH CHAPTER
			<Editor setData={setEditorData}/>
			<div>{editorData}</div>
        </div>
    );
}