import { Button, CircularProgress, Container, IconButton } from "@mui/material";
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import { Form } from "formik"
import { useSelector } from "react-redux";
import { object, string } from "yup";
import { useState } from "react";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { EmailOutlined } from "@mui/icons-material";
import { KeyOutlined } from "@mui/icons-material";

export const SignInScheme = object({
  email: string()
    .email('Invalid email!')
    .required("Email is required!"),
  password: string()
    .required("Password is required!")
})


const LoginForm = ({ values, handleChange, errors, touched, handleBlur, isSubmitting }) => {
  const { loading } = useSelector(state => state.auth)
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    if (password) {
      setShowPassword(!showPassword);
    }
  };

  const endAdornment = () => {
    return (
      <IconButton onClick={() => togglePasswordVisibility()}>
        {showPassword ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />}
      </IconButton>
    )
  }


  return (
    <Form>
                
      <Container  sx={{  marginBottom:"5rem", borderRadius: "10px"}}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Email"
            name="email"
            id="email"
            inputProps={{
              autoComplete: "off"
            }}
            type="email"
            variant="standard"
            color="secondary"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            helperText={touched.email && errors.email}
            error={touched.email && Boolean(errors.email)}
            InputLabelProps={{
              sx: {
                textAlign: 'left',
                left: values.email ? "5px" : "36px",
                top: "23px",
                fontSize: values.email ? "1.2rem" : "1.4rem",
                position: values.email ? 'relative' : 'absolute',
                transition: 'top 0.2s, left 0.2s, font-size 0.3s'
              }
            }}
            InputProps={{
              sx: {
                gap: ".8rem"
              },
              startAdornment: (
                <EmailOutlined color="action" />
              )
            }}
          />
          <TextField
            label="Password"
            name="password"
            id="password"
            type={showPassword ? "text" : "password"}
            variant="standard"
            color="secondary"
            inputProps={{
              autoComplete: "off"
            }}
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            helperText={touched.password && errors.password}
            error={touched.password && Boolean(errors.password)}
            InputLabelProps={{
              sx: {
                textAlign: 'left',
                left: values.password ? "5px" : "36px",
                top: "25px",
                fontSize: values.password ? "1.2rem" : "1.4rem",
                position: values.password ? 'relative' : 'absolute',
                transition: 'top 0.2s, left 0.2s, font-size 0.3s'
              }
            }}
            InputProps={{
              sx: {
                gap: ".5rem"
              },
              startAdornment: (
                <KeyOutlined color="action" />
              ),
              endAdornment: (
                endAdornment()
              )
            }}

          />

          {!loading ? (
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
              color="secondary"
            >
              {isSubmitting ? "Loading..." : "Sign In"}
            </Button>
          ) : (
            <Button variant="contained" disabled={loading}>
              <CircularProgress />
            </Button>
          )}

        </Box>
      </Container>
    </Form>
  );
}

export default LoginForm
