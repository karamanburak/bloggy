import 'react-slideshow-image/dist/styles.css'
import { Button, Card, CardContent, CardHeader, CardMedia, Container, Grid, Typography } from "@mui/material";
import PageHeader from './PageHeader';
import { toastWarnNotify } from '../../helper/ToastNotify';
import { useSelector } from 'react-redux';



const ShowsCard = ({ name, genres, image, summary, url }) => {
    const { currentUser } = useSelector(state => state.auth)
    

    const handleReadMore = () => {
        if (!currentUser) {
            toastWarnNotify("You must Login");
    } else {
        window.open(url, '_blank')
    }
    }

    return (
        <Container maxWidth="xl" sx={{ backgroundColor: "neutral.dark", paddingBottom: "2rem" }}>
            <PageHeader text="Tv-Shows" />
            <Card
                sx={{
                    minHeight: "300px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}>
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
                            title={name}
                            subheader={`${genres[0]} - ${genres[1]} - ${genres[2]}`}
                        />

                        <CardContent>
                            <Typography variant="body2" sx={{ maxHeight: "100px", overflow: "hidden" }} >
                                {summary}
                            </Typography>
                        </CardContent>
                        <Button variant="contained"
                            onClick={handleReadMore} 
                            sx={{
                                marginRight: "1rem",
                                marginBottom: "1rem",
                                backgroundColor: "primary.light",
                                display: "block",
                                marginLeft: "auto"
                            }} >
                            READ MORE
                        </Button>
                    </Grid>
                    <Grid item sm={12} md={6} order={{ xs: 2, md: 1 }} sx={{ margin: "auto", marginBottom: "1rem" }}>
                        <CardMedia
                            sx={{
                                marginTop: "1rem",
                                marginRight: "1rem",
                                padding: "1rem",
                                borderRadius: "1rem",
                                objectFit: "fill",
                                '& img': {
                                    borderRadius: "1rem"
                                }
                            }}
                            component="img"
                            height="274"
                            image={image?.original || image?.medium}
                            alt="image"
                        />
                    </Grid>
                </Grid>
            </Card>
        </Container>
    )
};

export default ShowsCard;
