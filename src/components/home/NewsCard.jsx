import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    Container,
    Grid,
    Typography
} from "@mui/material";
import React from "react";
import PageHeader from "./PageHeader";
import { useSelector } from "react-redux";
import { toastWarnNotify } from "../../helper/ToastNotify";

const defaultImage = 'https://www.shutterstock.com/image-vector/breaking-news-background-world-global-260nw-719766118.jpg'

const NewsCard = ({ description, publishedAt, urlToImage, url, title,source }) => {
    const { currentUser } = useSelector(state => state.auth)

    const handleReadMore = () => {
        if (!currentUser) {
            toastWarnNotify("You must Login");
        } else {
            window.open(url, '_blank')
        }
    }

    const localDate = () => {
        if (publishedAt) {
            return new Date(publishedAt).toLocaleString("de-DE")
        }
    }



    return (
        <Container maxWidth="xl" sx={{ backgroundColor: "neutral.dark", paddingBottom: "2rem" }}>
            <PageHeader text="News" />
            <Card
                sx={{
                    minHeight: "300px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                <Grid container>
                    <Grid item sm={12} md={6} order={{ xs: 2, md: 2 }}>
                        <CardHeader
                            sx={{
                                color: "seagreen",
                                '& .MuiTypography-root': {
                                    fontSize: 15,
                                    fontWeight: "bold"
                                }

                            }}
                            title={title}
                            subheader={`Published Date: ${localDate()}`}
                        />
                        <CardContent>
                            <Typography variant="body2" sx={{ maxHeight: "100px",color:"red" }} >
                                {source.name}
                            </Typography>
                            <Typography variant="body2" sx={{ maxHeight: "100px", overflow: "hidden" }} >
                                {description ? description : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident quam vero repudiandae totam, ab quod earum itaque explicabo illo sint laborum minus fugiat velit. Quasi non sapiente placeat id exercitationem."}
                            </Typography>
                        </CardContent>
                        <Box sx={{ display: "flex", justifyContent: "space-between", cursor: "pointer" }}>
                            <Button onClick={handleReadMore} variant="contained"
                                sx={{ backgroundColor: "primary.light",marginLeft:"auto", marginRight:"1rem" }} >
                                Read More
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item sm={12} md={6} order={{ xs: 2, md: 1 }} sx={{ margin: "auto", marginBottom: "1rem" }}>
                        <CardMedia
                            sx={{
                                marginTop: "1rem",
                                marginRight: "1rem",
                                padding: "1rem",
                            }}
                            component="img"
                            height="274"
                            image={urlToImage ? urlToImage : defaultImage}
                            alt="image"
                        />

                    </Grid>
                </Grid>
            </Card>
        </Container>
    )
}
export default NewsCard;
