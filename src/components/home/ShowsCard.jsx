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
import { toastWarnNotify } from "../../helper/ToastNotify";
import { useSelector } from "react-redux";
import { MdArrowOutward } from "react-icons/md";

const ShowsCard = ({ name, genres, image, summary, url, rating }) => {
  const { currentUser } = useSelector((state) => state.auth);

  const handleReadMore = () => {
    if (!currentUser) {
      toastWarnNotify("You must Login");
    } else {
      window.open(url, "_blank");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ paddingBottom: "2rem" }}>
      <PageHeader text="TV Shows" />
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
                variant="caption"
                sx={{ fontWeight: "bold", color: "text.secondary" }}
              >
                {genres.slice(0, 3).join(" • ")}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  mt: 1,
                  mb: 2,
                }}
              >
                {name}
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
                {summary}
              </Typography>
              <Typography
                sx={{
                  fontSize: "1rem",
                  fontWeight: "bold",
                }}
              >
                Rating: {rating.average}
              </Typography>
            </Box>
            <Box sx={{ marginLeft: "auto" }}>
              <Typography
                onClick={handleReadMore}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Read More <MdArrowOutward style={{ marginTop: ".2rem" }} />
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
              image={image?.original || image?.medium}
              height="374"
              alt="tv show image"
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
