import "react-slideshow-image/dist/styles.css";
import {
  Box,
  Button,
  Card,
  CardMedia,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import PageHeader from "./PageHeader";

const defaultImage =
  "https://images.unsplash.com/photo-1581905764498-f1b60bae941a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80";

const ShowsCard = ({ title, poster_path, overview, vote_average }) => {
  return (
    <Container maxWidth="lg" sx={{ paddingBottom: "2rem" }}>
      <PageHeader text="Now Playing" />
      <Card
        sx={{
          height: { xs: 730, md: 400 },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          overflow: "hidden",
          padding: "1rem",
        }}
      >
        <Grid container>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              p: 3,
            }}
          >
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  mt: 1,
                  mb: 2,
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mb: 3,
                  display: "-webkit-box",
                  WebkitLineClamp: { xs: 4, md: 6 },
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {overview}
              </Typography>
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: ".8rem",
                }}
              >
                Rating: {vote_average}
              </Typography>
            </Box>
          </Grid>

          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CardMedia
              component="img"
              image={
                poster_path
                  ? "https://image.tmdb.org/t/p/w1280" + poster_path
                  : defaultImage
              }
              height="374"
              alt={`image for ${title}`}
              sx={{
                width: "100%",
                objectFit: "fill",
                borderRadius: "1rem",
              }}
            />
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default ShowsCard;
