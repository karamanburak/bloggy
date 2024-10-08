import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import AppRegistrationSharpIcon from "@mui/icons-material/AppRegistrationSharp";
import Grid from "@mui/material/Grid";
import { Formik } from "formik";
import RegisterForm, { SignupSchema } from "../components/auth/RegisterForm";
import Information from "../components/auth/Information";
import Footer from "../components/home/Footer";
import useAuthCall from "../hooks/useAuthCall";

const Register = () => {
  const { register } = useAuthCall();
  return (
    <>
      <Container sx={{ backgroundColor: "primary.main", minWidth: "100%" }}>
        <Grid
          container
          justifyContent="center"
          sx={{
            minHeight: "90vh",
            p: 2,
            gap: 1,
          }}
        >
          <Grid item xs={12} sm={10} md={7} lg={4}>
            <Information />
          </Grid>
          <Grid item xs={12} sm={10} md={4}>
            <Avatar
              sx={{
                backgroundColor: "secondary.main",
                m: "auto",
                width: 40,
                height: 40,
                marginTop: "8rem",
              }}
            >
              <AppRegistrationSharpIcon />
            </Avatar>
            <Typography
              variant="h4"
              align="center"
              mb={1}
              color="neutral.light"
            >
              Register Form
            </Typography>

            <Formik
              initialValues={{
                username: "",
                firstName: "",
                lastName: "",
                email: "",
                image: "",
                bio: "",
                city: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={SignupSchema}
              onSubmit={(values, actions) => {
                register(values);
                actions.resetForm();
                actions.setSubmitting(false);
              }}
              component={(props) => <RegisterForm {...props} />}
            ></Formik>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default Register;
