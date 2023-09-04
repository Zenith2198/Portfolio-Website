"use client"

import React, { useState } from 'react';
import type { ChangeEvent } from "react";
import NewPostPanel from "@/components/NewPostPanel";
import EditPostPanel from "@/components/EditPostPanel";

export default function AdminPanel() {
	const [optionSelect, setOptionSelect] = useState("newPost");
	const handleOptionSelect = (event: ChangeEvent<HTMLInputElement>) => {
		setOptionSelect(event.target.value);
	};

    return (
        <div>
			<div className="join" onChange={handleOptionSelect}>
				<input value="newPost" defaultChecked className="join-item btn" type="radio" name="options" aria-label="New Post"/>
				<input value="editPost" className="join-item btn" type="radio" name="options" aria-label="Edit Post"/>
			</div>
			<NewPostPanel className={`${optionSelect==="newPost"?"block":"hidden"}`}/>
			<EditPostPanel className={`${optionSelect==="editPost"?"block":"hidden"}`}/>
        </div>
    );
}