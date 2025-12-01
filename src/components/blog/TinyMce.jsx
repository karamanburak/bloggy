import { Button } from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import DOMPurify from "dompurify";
import React from "react";

const TinyMce = ({ setInfo, content }) => {
  const tinyMceApiKey = import.meta.env.VITE_TinyMCE_apiKey;
  const editorRef = React.useRef(null);
  const initialContent = React.useMemo(() => content || "", []);
  const isUpdatingRef = React.useRef(false);

  const handleEditorChange = (content, editor) => {
    //* Prevent cursor jump by not updating state if we're in the middle of an update
    if (isUpdatingRef.current) {
      return;
    }
    
    //* Save cursor position before state update
    const selection = editor.selection;
    const bookmark = selection.getBookmark(2, true);
    
    //* Alternatively, strip HTML using DOMParser
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const text = doc.body.textContent || "";
    
    //* Update state asynchronously to prevent blocking
    isUpdatingRef.current = true;
    setInfo((prevInfo) => ({ ...prevInfo, content: text }));
    
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
        // onChange={handleChange}
        // value={info.content}
      />
    </>
  );
};

export default TinyMce;
