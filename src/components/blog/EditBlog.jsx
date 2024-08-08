import React, { useState } from 'react';
import { Box, Button, TextField, Modal } from '@mui/material';
import useBlogCall from '../../hooks/useBlogCall';
import { useEffect } from 'react';

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

const EditBlog = ({ open, onClose, blog }) => {
    const [title, setTitle] = useState(blog.title);
    const [content, setContent] = useState(blog.content);
    const [image, setImage] = useState(blog.image);
    const { putBlog } = useBlogCall();

    const [info, setInfo] = useState({
        title: title,
        content: content,
        image: image,
    })

    const updateFormField = [
        { id: "title", name: "title", label: "Title ", type: "text" },
        { id: "content", name: "content", label: "Content ", type: "text" },
        { id: "image", name: "image", label: "Image URL", type: "text" },

    ]

    const handleChange = (e) => {
        setInfo({ ...info, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await putBlog("blogs", blog._id, info)
        onClose();
    };

    useEffect(() => {
        if (blog) {
            setTitle(blog.title || '');
            setContent(blog.content || '');
            setImage(blog.image || '');
        }
    }, [blog]);

    return (
        <Modal open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box sx={{ ...style, backgroundColor: "primary.main" }}>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {updateFormField.map((field) => (
                        <TextField
                            key={field.id}
                            label={field.label}
                            name={field.name}
                            id={field.id}
                            variant="standard"
                            color="secondary"
                            type={field.type}
                            value={info[field.name]}
                            onChange={handleChange}
                        />

                    ))}
                    <Button
                        sx={{ backgroundColor: "secondary.main" }}
                        variant="contained"
                        type="submit">
                        Update Blog
                    </Button>
                </Box>

            </Box>
        </Modal>
    );
};

export default EditBlog;