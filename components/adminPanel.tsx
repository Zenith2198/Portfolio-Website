"use client"

import React, { useState } from 'react';
import Editor from "@/components/editor";

export default function Admin() {
	const [data, setData] = useState(false);

    return (
        <div>
			<Editor setData={setData}/>
			<div>{data}</div>
        </div>
    );
}