import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useState } from 'react';
import useBlogCall from '../../hooks/useBlogCall';
import { useSelector } from 'react-redux';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function BlogModal({ open, handleClose, initialState,categories }) {
  const { postBlog } = useBlogCall()
  const blogs = useSelector(state => state.blog.blogs);
  const [info, setInfo] = useState(initialState)



  const handleChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value })
    
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("submit", info);
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
              value={info.isPublish || ""}

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