import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { TextField } from '@mui/material';
import { useState } from 'react';
import useAuthCall from '../../hooks/useAuthCall';

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

export default function UpdateProfileModal({
    open,
    handleClose,
    image,
    username,
    email,
    bio,
    city,
    firstName,
    lastName,

}) {
    
    const { updateUser } = useAuthCall()
    const [info, setInfo] = useState({
        username: username,
        firstName: firstName,
        lastName: lastName,
        email: email,
        image: image,
        bio: bio,
        city: city,
        password: "",
    })



    const updateFormField = [
        { id: "username", name: "username", label: "Username ", type: "text" },
        { id: "firstName", name: "firstName", label: "First Name ", type: "text" },
        { id: "lastName", name: "lastName", label: "Last Name ", type: "text" },
        { id: "email", name: "email", label: "Email Address ", type: "text" },
        { id: "image", name: "image", label: "Image ", type: "text" },
        { id: "bio", name: "bio", label: "Biography ", type: "text" },
        { id: "city", name: "city", label: "City ", type: "text" },
        { id: "password", name: "password", label: "Password ", type: "password", },
    ]


    const handleChange = (e) => {
        setInfo({ ...info, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
       await updateUser(info)
        handleClose();
    }


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
                    {updateFormField.map((field) => (
                        <TextField
                            key={field.id}
                            label={field.label}
                            name={field.name}
                            id={field.id}
                            variant="standard"
                            color="secondary"
                            inputProps={{
                                autoComplete: "off"
                            }}
                            type={field.type}
                            value={info[field.name]}
                            onChange={handleChange}
                            required={field.name === "password"}
                        />

                    ))}
                    <Button
                        sx={{ backgroundColor: "secondary.main" }}
                        variant="contained"
                        type="submit">
                        UPDATE PROFILE
                    </Button>
                </Box>

            </Box>
        </Modal>
    );
}
