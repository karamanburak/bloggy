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

const MealsCard = ({ strCategory, strCategoryDescription, strCategoryThumb }) => {

    return (
        <Container maxWidth="xl" sx={{ backgroundColor: "neutral.dark", paddingBottom: "2rem" }}>
            <PageHeader text="Meals" />
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
                            title={strCategory}
                        />
                        <CardContent>

                            <Typography variant="body2" sx={{ maxHeight: "100px", overflow: "hidden" }} >
                                {strCategoryDescription}
                            </Typography>
                        </CardContent>

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
                            image={strCategoryThumb}
                            alt="image"
                        />

                    </Grid>
                </Grid>
            </Card>
        </Container>
    )
};

export default MealsCard;
