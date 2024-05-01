import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import AppRegistrationSharpIcon from '@mui/icons-material/AppRegistrationSharp';
import Grid from "@mui/material/Grid";
import { Formik } from 'formik';
import RegisterForm, { SignupSchema } from "../components/auth/RegisterForm";
import Information from "../components/auth/Information";
import { container } from "../styles/globalStyles";

const Register = () => {
  return (
    <Container sx={container}>
      <Grid
        container
        justifyContent="center"
        direction="row-reverse"
        sx={{
          minHeight: "100vh",
          p: 2,
          gap: 1,
        }}
      >
        <Grid item xs={12} sm={10} md={4}>
          <Avatar
            sx={{
              backgroundColor: "secondary.main",
              m: "auto",
              width: 40,
              height: 40,
              marginTop: "2rem"
            }}
          >
            <AppRegistrationSharpIcon />
          </Avatar>
          <Typography
            variant="h4"
            align="center"
            mb={1}
            color="secondary.light"
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
              // register(values);
              // actions.resetForm();
              // actions.setSubmitting(false);
            }}
            component={(props) => <RegisterForm {...props} />}
          ></Formik>
        </Grid>
        <Grid item xs={12} sm={10} md={7} lg={5}>
              <Information />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Register;
