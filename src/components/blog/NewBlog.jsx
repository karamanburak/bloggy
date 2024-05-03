import { Container } from "@mui/material";
import { Formik } from "formik";
import BlogModal from "./BlogModal";
import useBlogCall from "../../hooks/useBlogCall";

const NewBlog = () => {
    const { postBlog } = useBlogCall();
    console.log(postBlog);
    return (
        <Container >
            <Formik
                initialValues={{
                    title: "",
                    image: "",
                    categoryId: "",
                    content: "",
                    isPublish: true,
                }}
                onSubmit={(values, actions) => {
                    createBlog("blogs", values);
                    actions.resetForm();
                    actions.setSubmitting(false);
                }}
                validationSchema={SignupSchema}
                component={(props) => <BlogModal{...props} />}
            ></Formik>
        </Container>
    );
};

export default NewBlog;