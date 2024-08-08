import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import React from "react";
import { useState } from "react";
import useBlogCall from "../../hooks/useBlogCall";
import { useNavigate } from "react-router-dom";
import { FiDelete } from "react-icons/fi";


const DeleteBlog = ({ id }) => {
    const [open, setOpen] = useState(false);
    const { deleteBlog } = useBlogCall()
    const navigate = useNavigate()



    const handleDelete = () => {
        setOpen(false);
        deleteBlog("blogs", id)
        navigate(-1)
    };


    return (
        <Box sx={{ display: "flex", gap: 2, justifyContent: { xs: "center", lg: "flex-end" } }}>
            <Typography
                onClick={() => setOpen(true)}>
                <FiDelete style={{ marginRight: ".5rem" }} />  Delete Blog
            </Typography>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this blog post?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} sx={{ color: 'gray' }}>Cancel</Button>
                    <Button onClick={handleDelete} sx={{ color: 'red' }}>Delete</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
};

export default DeleteBlog;
