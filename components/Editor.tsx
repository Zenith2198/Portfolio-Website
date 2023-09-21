//@ts-nocheck

"use client"

import React, { useState, useEffect, useRef } from "react";

export default function Editor ({ id, className, data="", setData }: { id?: string, className?: string, data?: string, setData: any }) {
	const editorRef = useRef();
	const [editorLoaded, setEditorLoaded] = useState(false);
	const { CKEditor, ClassicEditor } = editorRef.current || {};

	useEffect(() => {
		editorRef.current = {
			CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
			ClassicEditor: require("@ckeditor/ckeditor5-build-classic")
		};
		setEditorLoaded(true);
	}, []);

  	return editorLoaded ? (
		<div id={id} className={`${className} textarea text-black`}>
			<CKEditor
				editor={ClassicEditor}
				data={data}
				onChange={(event, editor) => {
					const data = editor.getData();
					setData(data);
				}}
			/>
		</div>
	) : (
		<div>Editor loading</div>
	);
}
