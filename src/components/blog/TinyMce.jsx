import { Editor } from '@tinymce/tinymce-react';
import React from "react";




const TinyMce = ({ setInfo, content }) => {
    const tinyMceApiKey = 'ac9cwhopnulcef9wks894b69d3qa7bknbma3g19u30dkybq7';
    const editorRef = React.useRef(null);



    const handleEditorChange = (content) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const text = doc.body.textContent || "";
        setInfo((prevInfo) => ({ ...prevInfo, content: text }));
    };

    React.useEffect(() => {
        if (editorRef.current) {
            editorRef.current.setContent(content || '');
        }
    }, [content]);


    return (
        <>
            <Editor apiKey={tinyMceApiKey}
                onInit={(evt, editor) => (editorRef.current = editor)}
                initialValue={content}
                init={{
                    height: 250,
                    menubar: false,
                    placeholder: "Write your content here",
                    plugins: [
                        'a11ychecker', 'advlist', 'advcode', 'advtable', 'autolink', 'checklist', 'export',
                        'lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'searchreplace', 'visualblocks',
                        'powerpaste', 'fullscreen', 'formatpainter', 'insertdatetime', 'media', 'table', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | casechange blocks | bold italic backcolor | ' +
                        'alignleft aligncenter alignright alignjustify | ' + ' image ' +
                        'bullist numlist checklist outdent indent | removeformat | a11ycheck code table help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; text-align: left; direction: ltr}',
                }}


                onEditorChange={handleEditorChange}
            // onChange={handleChange}
            // value={info.content}

            />
        </>
    )
};

export default TinyMce;
