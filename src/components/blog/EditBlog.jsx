import React, { useState } from 'react';
import { Box, Button, TextField, Modal } from '@mui/material';
import useBlogCall from '../../hooks/useBlogCall';
import TinyMce from './TinyMce';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: 350, sm: 500, md: 700 },
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const EditBlog = ({ open, onClose, blog, initialState }) => {
    const { putBlog } = useBlogCall();

    const [info, setInfo] = useState(initialState)


    const updateFormField = [
        { id: "title", name: "title", label: "Title ", type: "text" },
        { id: "image", name: "image", label: "Image URL", type: "text" },

    ]

    const handleChange = (e) => {
        setInfo({ ...info, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        putBlog("blogs", blog._id, info)
        onClose();
    };


    return (
        <Modal open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box sx={{ ...style, backgroundColor: "neutral.dark" }}>
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
                    <TinyMce content={initialState.content} setInfo={setInfo} />
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