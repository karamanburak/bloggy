import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Form } from "formik";
import * as Yup from "yup";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import { IconButton, InputAdornment } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import { EmailOutlined } from "@mui/icons-material";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import { KeyOutlined } from "@mui/icons-material";

export const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(3)
    .max(15)
    .required('Username is requiered!'),
  firstName: Yup.string()
    .min(2, 'Too Short!')
    .max(20, 'Too Long!')
    .required('First name is required!'),
  lastName: Yup.string()
    .min(2, 'Too Short!')
    .max(20, 'Too Long!')
    .required('Last name is required!'),
  email: Yup.string().email('Invalid email').required('Email is required!'),
  password: Yup.string()
    .min(8, "The password must be at least 8 characters long")
    .max(20, "The password may be a maximum of 20 characters long")
    .matches(/\d/, "The password must contain at least one number!")
    .matches(/[a-z]/, "The password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "The password must contain at least one capital letter")
    .matches(/[@$?!%&*.]+/, "The password must contain at least one special character (@$!%*?&.)")
    .required("The password is required!"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Please make sure your passwords match')
    .required("Confirm password is required!")
});

const registerFormField = [
  { id: "username", name: "username", label: "Username *", type: "text", icon: <PersonIcon /> },
  { id: "firstName", name: "firstName", label: "First Name *", type: "text", icon: <PersonIcon /> },
  { id: "lastName", name: "lastName", label: "Last Name *", type: "text", icon: <PersonIcon /> },
  { id: "email", name: "email", label: "Email Address *", type: "text", icon: <EmailOutlined/> },
  { id: "image", name: "image", label: "Image ", type: "text", icon: <AddPhotoAlternateIcon/> },
  { id: "bio", name: "bio", label: "Biography ", type: "text",  icon: <HistoryEduIcon/> },
  { id: "password", name: "password", label: "Password *", type: "password", icon: <KeyOutlined/> },
  { id: "confirmPassword", name: "confirmPassword", label: "Confirm Password *", type: "password", icon: <KeyOutlined /> },
]

const RegisterForm = ({
  values,
  handleChange,
  errors,
  touched,
  handleBlur,
  isSubmitting,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const endAdornment = (field) => {
    return (
      <InputAdornment position="end">
        <IconButton onClick={() => togglePasswordVisibility(field)}>
          {field === 'password' ? (showPassword ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />) : null}
          {field === 'confirmPassword' ? (showConfirmPassword ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />) : null}
        </IconButton>
      </InputAdornment>
    )
  }

  return (
    <Form>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {registerFormField.map((field) => (
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
            type={field.type === 'password' ? (field.name === 'password' ? (showPassword ? 'text' : 'password') : (showConfirmPassword ? 'text' : 'password')) : field.type}
            value={values[field.name]}
            onChange={handleChange}
            onBlur={handleBlur}
            helperText={touched[field.name] && errors[field.name]}
            error={touched[field.name] && Boolean(errors[field.name])}
            InputLabelProps={{
              sx: {
                textAlign: 'left',
                left: "35px",
                top: "23px",
                fontSize: values[field.name] ? "1rem" : "1.2rem",
                position: values[field.name] ? 'relative' : 'absolute',
              },
            }}
            InputProps={{
              startAdornment: field.icon && ( 
                <InputAdornment position="start">
                  {field.icon}
                </InputAdornment>
              ),
              endAdornment: endAdornment(field.name),
            }}
          />

        ))}

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isSubmitting}
          color="secondary">
          {isSubmitting ? "Loading..." : "Sign Up"}
        </Button>
      </Box>
    </Form>
  );
};

export default RegisterForm;
