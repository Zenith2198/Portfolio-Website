//@ts-nocheck

"use client"

import React, { useState, useEffect, useRef } from 'react';

export default function Editor ({ setData }) {
	const editorRef = useRef();
	const [editorLoaded, setEditorLoaded] = useState(false);
	const { CKEditor, ClassicEditor } = editorRef.current || {};

	useEffect(() => {
		editorRef.current = {
			CKEditor: require('@ckeditor/ckeditor5-react').CKEditor,
			ClassicEditor: require('@ckeditor/ckeditor5-build-classic')
		}
		setEditorLoaded(true)
	}, []);

  	return editorLoaded ? (
		<div>
			<CKEditor
				editor={ClassicEditor}
				data='<p>Hello from CKEditor 5!</p>'
				onInit={editor => {
					// You can store the "editor" and use when it is needed.
					console.log('Editor is ready to use!', editor)
				}}
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