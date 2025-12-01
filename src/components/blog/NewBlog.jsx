import { Container } from "@mui/material";
import { Formik } from "formik";
import BlogModal from "./BlogModal";
import useBlogCall from "../../hooks/useBlogCall";
import { useSelector } from "react-redux";
import useCategoryCall from "../../hooks/useCategoryCall";
import { useEffect } from "react";

const NewBlog = () => {
    const { postBlog } = useBlogCall();
    const { categories } = useSelector((state) => state.category);
    const { getCategory } = useCategoryCall();

    useEffect(() => {
        getCategory("categories");
    }, []);

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
                    postBlog("blogs", values);
                    actions.resetForm();
                    actions.setSubmitting(false);
                }}
                component={(props) => <BlogModal {...props} categories={categories} />}
            ></Formik>
        </Container>
    );
};

export default NewBlog;