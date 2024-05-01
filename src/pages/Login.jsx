import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import PeopleSharpIcon from '@mui/icons-material/PeopleSharp';
import { Link } from "react-router-dom";
import { Formik } from "formik";
// import useAuthCall from "../hooks/useAuthCall";
import LoginForm, { loginScheme } from "../components/auth/LoginForm";
import { container } from "../styles/globalStyles";
import AuthImage from "../components/global/AuthImage";
import image from '../assets/login.png'

const Login = () => {
  // const { login } = useAuthCall();
  return (
    <>
      <Container sx={container}>
        <Grid
          container
          justifyContent="center"
          direction="row-reverse"
          alignItems="center"
          sx={{
            minHeight: "100vh",
            p: 2,
            gap:6
          }}
        >
          <Grid item xs={12} sm={10} md={5} lg={4}>
            <Avatar
              sx={{
                backgroundColor: "secondary.main",
                m: "auto",
                width: 40,
                height: 40,
              }}
            >
              <PeopleSharpIcon />
            </Avatar>
            <Typography variant="h4" align="center" mb={4} color="secondary">
              SIGN IN
            </Typography>

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={loginScheme}
              onSubmit={(values, actions) => {
                // login(values);
                actions.resetForm();
                actions.setSubmitting(false);
              }}
              component={props => <LoginForm {...props} />}
              >

            </Formik>
            <Box sx={{ textAlign: "center", mt: 2  }}>
              <Link to="/register" style={{ color: "#4CCEAC", }}>
                Don't have an account? Sign up for Bloggy
              </Link>
            </Box>
          </Grid>
          <AuthImage image={image}/>
        </Grid>
      </Container>
    </>
  );
};

export default Login;
