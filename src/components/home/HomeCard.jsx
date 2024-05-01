import { Card, Container, Typography } from "@mui/material";
import React from "react";
import { spanStyle } from "../../styles/globalStyles";

const HomeCard = () => {

    return (
        <Container maxWidth={"xl"} >
            <Card sx={{ marginTop: "-2rem", position: "relative", backgroundColor: "neutral.dark" }}>
                <Typography sx={{ textAlign: "center", padding:"2rem"}}>
                    <span style={spanStyle}>Welcome to the Bloggy!</span> <br />
                    Bloggy aims to provide you with unique information, useful tips and exciting stories from a wide variety of fields. Whether it's technology, culture, travel or lifestyle, you'll always be able to produce and find fresh content that informs, inspires and entertains.
                </Typography>
                <Typography sx={{ textAlign: "center", padding:"2rem" }}>
                    <span style={spanStyle}>Welcome to the Bloggy!</span> <br />
                    Bloggy aims to provide you with unique information, useful tips and exciting stories from a wide variety of fields. Whether it's technology, culture, travel or lifestyle, you'll always be able to produce and find fresh content that informs, inspires and entertains.
                </Typography>
                <Typography sx={{ textAlign: "center", padding:"2rem" }}>
                    <span style={spanStyle}>Welcome to the Bloggy!</span> <br />
                    Bloggy aims to provide you with unique information, useful tips and exciting stories from a wide variety of fields. Whether it's technology, culture, travel or lifestyle, you'll always be able to produce and find fresh content that informs, inspires and entertains.
                </Typography>
                <Typography sx={{ textAlign: "center", padding:"2rem" }}>
                    <span style={spanStyle}>Welcome to the Bloggy!</span> <br />
                    Bloggy aims to provide you with unique information, useful tips and exciting stories from a wide variety of fields. Whether it's technology, culture, travel or lifestyle, you'll always be able to produce and find fresh content that informs, inspires and entertains.
                </Typography>
            </Card>
        </Container>
    )
};

export default HomeCard;
