import { Editor } from '@tinymce/tinymce-react';
import DOMPurify from 'dompurify';
import React from "react";

const TinyMce = ({ setInfo, content }) => {
    const tinyMceApiKey = import.meta.env.VITE_TinyMCE_apiKey;
    const editorRef = React.useRef(null);


    const handleEditorChange = (content) => {
        //* Alternatively, strip HTML using DOMParser
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const text = doc.body.textContent || "";
        // const cleanContent = DOMPurify.sanitize(dirtyContent, {
        //     ALLOWED_TAGS: [],
        //     ALLOWED_ATTR: []
        // });    
        setInfo((prevInfo) => ({ ...prevInfo, content: text }));
        // console.log(text);

    };


    return (
        <>
            <Editor
                apiKey={tinyMceApiKey}
                onInit={(evt, editor) => (editorRef.current = editor)}
                initialValue={content}
                init={{
                    height: 250,
                    menubar: true,
                    placeholder: "Write your content here",
                    plugins: [
                        'a11ychecker', 'advlist', 'advcode', 'advtable', 'autolink', 'checklist', 'export',
                        'lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'searchreplace', 'visualblocks',
                        'powerpaste', 'fullscreen', 'formatpainter', 'insertdatetime', 'media', 'table', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | casechange blocks | bold italic backcolor | ' +
                        'alignleft aligncenter alignright alignjustify | image ' +
                        'bullist numlist checklist outdent indent | removeformat | a11ycheck code table help',
                    directionality: "ltr",
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; text-align: left;}',
                }}
                onEditorChange={handleEditorChange}
            // onChange={handleChange}
            // value={info.content}
            />
        </>
    )
};

export default TinyMce;
