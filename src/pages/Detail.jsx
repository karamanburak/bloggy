import React from "react";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import { Box, Button, Grid, IconButton } from "@mui/material";
import { useLocation } from "react-router-dom";
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useNavigate } from "react-router-dom";


const Detail = () => {
    const navigate = useNavigate()
    const { state } = useLocation()
    const { _id, content, image, title, userId, createdAt } = state;
    const localDate = () => {
        if (createdAt) {
            return new Date(createdAt).toLocaleString("de-DE")
        }
    }

    return (
            <Card sx={{
                backgroundColor: "primary.dark", padding: "2rem", minHeight:"90vh"
            }}>
                <Grid container>
                    <Grid item sx={{ margin: "auto" }}>
                        <CardMedia
                            sx={{ borderRadius: "5px" }}
                            component="img"
                            height="400"
                            image={image}
                            alt="image"
                        />
                    </Grid>
                    <Grid item sx={{
                        margin: "auto",
                        width: {
                            xs: "100%",
                            sm: "80%",
                            lg: "50vw"
                        },

                    }}>
                        <CardHeader
                            sx={{
                                color: "aqua",
                                '& .MuiTypography-root': {
                                    fontSize: 18,
                                    fontWeight: "bold"
                                }
                            }}
                            avatar={
                                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                    R
                                </Avatar>
                            }
                            title={title}
                            subheader={`Published Date: ${localDate()}`}
                        />
                        <CardContent>
                            <Typography variant="body2" sx={{ textAlign: "justify" }} >
                                {content}
                            </Typography>
                            <Box>
                                <IconButton>
                                    <FavoriteIcon />
                                </IconButton>
                                <IconButton>
                                    <CommentIcon />
                                </IconButton>
                                <IconButton>
                                    <RemoveRedEyeIcon />
                                </IconButton>
                            </Box>
                        </CardContent>
                        <Button onClick={() => navigate(-1)} variant="contained" sx={{ marginLeft: "1rem", marginBottom: "1rem", backgroundColor: "primary.light" }} >
                            Go BACK
                        </Button>
                    </Grid>
                </Grid>
            </Card>

    )
};

export default Detail;
