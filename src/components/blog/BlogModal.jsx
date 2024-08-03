import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useState } from 'react';
import useBlogCall from '../../hooks/useBlogCall';
import { toastWarnNotify } from '../../helper/ToastNotify';
import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useTheme } from '@mui/material/styles';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function BlogModal({ open, handleClose, initialState, categories }) {
  const { postBlog } = useBlogCall()
  const [info, setInfo] = useState(initialState)
  const tinyMceApiKey = 'ac9cwhopnulcef9wks894b69d3qa7bknbma3g19u30dkybq7';
  const editorRef = useRef(null);

  const theme = useTheme()

  const handleChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value })


  }

  const handleEditorChange = (content) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const text = doc.body.textContent || "";
    setInfo((prevInfo) => ({ content: text, ...prevInfo }));
  };


  const handleSubmit = (e) => {
    e.preventDefault()
    // const contentLength = info.content.trim().split(/\s+/).length;
    // if (contentLength < 30) {
    //   toastWarnNotify("Content must be least 30 words")
    //   return;
    // }
    // console.log("submit", info);
    postBlog("blogs", info)
    handleClose()
  }


  const isPublish = [
    { id: 1, name: "Published", value: true },
    { id: 2, name: "Draft", value: false },
  ];

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <Box sx={{ ...style, backgroundColor: "primary.main" }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Title *"
            name="title"
            id="title"
            type="text"
            variant="outlined"
            value={info.title}
            onChange={handleChange}
            color="success"
          />
          <TextField
            label="Image URL *"
            name="image"
            id="image"
            type="text"
            variant="outlined"
            value={info.image}
            onChange={handleChange}
            color="success"
          />

          <FormControl fullWidth>
            <InputLabel id="demo-simple-category-label">Category</InputLabel>
            <Select
              labelId="demo-simple-category-label"
              id="categoryId"
              label="Category *"
              name="categoryId"
              onChange={handleChange}
              color="success"
              value={info.categoryId || ""}


            >
              {
                categories.map(category => <MenuItem key={category._id} value={category._id}>{category.name}</MenuItem>)
              }
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="demo-simple-isPublish-label">Status</InputLabel>
            <Select
              labelId="demo-simple-isPublish-label"
              label="Status *"
              id="isPublish"
              name="isPublish"
              onChange={handleChange}
              color="success"
              value={info.isPublish}

            >
              {
                isPublish.map(status => <MenuItem key={status.id} value={status.value}>{status.name}</MenuItem>)
              }
            </Select>
          </FormControl>

          <TextField
            id="content"
            name='content'
            label="Content *"
            rows={4}
            value={info.content}
            multiline
            variant="filled"
            color='success'
            type='text'
            onChange={handleChange}
          />
          {/* <Editor apiKey={tinyMceApiKey}
            onInit={(evt, editor) => (editorRef.current = editor)}
            initialValue={info.content}
            init={{
              height: 250,
              menubar: false,
              plugins: [
                'a11ychecker', 'advlist', 'advcode', 'advtable', 'autolink', 'checklist', 'export',
                'lists', 'link', 'image', 'charmap', 'preview', 'anchor', 'searchreplace', 'visualblocks',
                'powerpaste', 'fullscreen', 'formatpainter', 'insertdatetime', 'media', 'table', 'help', 'wordcount'
              ],
              toolbar: 'undo redo | casechange blocks | bold italic backcolor | ' +
                'alignleft aligncenter alignright alignjustify | ' + ' image ' +
                'bullist numlist checklist outdent indent | removeformat | a11ycheck code table help',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; text-align: left; }',
            }} 
 

          onEditorChange={handleEditorChange}
          // onChange={handleChange}
          // value={info.content}

          /> */}

          <Button
            sx={{ backgroundColor: "secondary.main" }}
            variant="contained"
            type="submit">
            Create Blog
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}