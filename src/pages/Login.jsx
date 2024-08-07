import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import PeopleSharpIcon from '@mui/icons-material/PeopleSharp';
import { Link } from "react-router-dom";
import { Formik } from "formik";
import useAuthCall from "../hooks/useAuthCall";
import LoginForm, { SignInScheme } from "../components/auth/LoginForm";
import AuthImage from "../components/global/AuthImage";
import image from '../assets/login.png'
import Footer from "../components/home/Footer";

const Login = () => {
  const { login } = useAuthCall();

  return (
    <>
      <Container sx={{ backgroundColor: "primary.main", minWidth: "100%" }}>
        <Grid
          container
          justifyContent="center"
          direction="row-reverse"
          alignItems="center"
          sx={{
            minHeight: "100vh",
            p: 2,
            gap: 6
          }}
        >
          <Grid item xs={12} sm={10} md={5} lg={4}>
            <Avatar
              sx={{
                backgroundColor: "secondary.main",
                m: "auto",
                width: 40,
                height: 40,
                marginTop: "6rem"
              }}
            >
              <PeopleSharpIcon />
            </Avatar>
            <Typography variant="h4" align="center" color="neutral.light">
              SIGN IN
            </Typography>

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={SignInScheme}
              onSubmit={(values, actions) => {
                login(values);
                actions.resetForm();
                actions.setSubmitting(false);
              }}
              component={props => <LoginForm {...props} />}
            >

            </Formik>
            <Box sx={{ textAlign: "center", mt: -6 }}>
              <Link to="/register" style={{ color: "cornflowerblue" }}>
                Don't have an account? Sign up for Bloggy
              </Link>
            </Box>
          </Grid>
          <AuthImage image={image} />
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default Login;
