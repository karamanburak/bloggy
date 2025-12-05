import { Editor } from "@tinymce/tinymce-react";
import DOMPurify from "dompurify";
import React from "react";

const TinyMce = ({ setInfo, content }) => {
  const tinyMceApiKey = import.meta.env.VITE_TinyMCE_apiKey;
  const editorRef = React.useRef(null);
  const initialContent = React.useMemo(() => content || "", [content]);
  const isUpdatingRef = React.useRef(false);

  const handleEditorChange = (htmlContent, editor) => {
    //* Prevent cursor jump by not updating state if we're in the middle of an update
    if (isUpdatingRef.current) {
      return;
    }
    
    //* Save cursor position before state update
    const selection = editor.selection;
    const bookmark = selection.getBookmark(2, true);
    
    //* Sanitize HTML content to prevent XSS attacks
    const sanitizedContent = DOMPurify.sanitize(htmlContent, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'table', 'thead', 'tbody', 
        'tr', 'td', 'th', 'code', 'pre', 'span', 'div'
      ],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'style', 'width', 'height'],
      ALLOW_DATA_ATTR: false
    });
    
    //* Update state with sanitized HTML content (not plain text!)
    isUpdatingRef.current = true;
    setInfo((prevInfo) => ({ ...prevInfo, content: sanitizedContent }));
    
    //* Restore cursor position immediately after state update
    requestAnimationFrame(() => {
      if (editorRef.current && bookmark) {
        try {
          const currentSelection = editorRef.current.selection;
          currentSelection.moveToBookmark(bookmark);
        } catch (e) {
          // Ignore errors if bookmark is invalid
        }
      }
      isUpdatingRef.current = false;
    });
  };

  return (
    <>
      <Editor
        apiKey={tinyMceApiKey}
        onInit={(evt, editor) => {
          editorRef.current = editor;
        }}
        initialValue={initialContent}
        init={{
          height: 250,
          menubar: true,
          placeholder: "Write your content here",
          plugins: [
            // "a11ychecker",
            // "advlist",
            // "advcode",
            // "advtable",
            "autolink",
            // "checklist",
            // "export",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            // "powerpaste",
            // "fullscreen",
            // "formatpainter",
            "insertdatetime",
            "media",
            "table",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | casechange blocks | bold italic backcolor | " +
            "alignleft aligncenter alignright alignjustify | image " +
            "bullist numlist checklist outdent indent | removeformat | a11ycheck code table help",
          directionality: "ltr",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px; text-align: left; direction: ltr;}",
        }}
        onEditorChange={(content, editor) => handleEditorChange(content, editor)}
      />
    </>
  );
};

export default TinyMce;
