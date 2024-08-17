import "react-slideshow-image/dist/styles.css";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
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
    <Container
      maxWidth="xl"
      sx={{ backgroundColor: "neutral.dark", paddingBottom: "2rem" }}
    >
      <PageHeader text="Tv-Shows" />
      <Card
        sx={{
          height: { xs: 730, md: 400 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Grid container>
          <Grid
            item
            sm={12}
            md={6}
            order={{ xs: 2, md: 2 }}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              my: 3,
              p: 2,
              borderRadius: "12px",
            }}
          >
            <Box>
              <CardHeader
                sx={{
                  "& .MuiTypography-root": {
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "text.primary",
                  },
                }}
                title={name}
                subheader={
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "text.secondary", mt: 1 }}
                  >
                    {genres.slice(0, 3).join(" • ")}
                  </Typography>
                }
              />
            </Box>

            <CardContent sx={{ mt: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  maxHeight: "80px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: "3",
                  WebkitBoxOrient: "vertical",
                  color: "text.secondary",
                  lineHeight: 1.5,
                }}
              >
                {summary}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                  mt: 1,
                }}
              >
                Rating: {rating.average}
              </Typography>
            </CardContent>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
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
            sm={12}
            md={6}
            order={{ xs: 1, md: 2 }}
            sx={{ margin: "auto", marginBottom: "1rem" }}
          >
            <CardMedia
              sx={{
                marginTop: "1rem",
                marginRight: "1rem",
                padding: "1rem",
                borderRadius: "1rem",
                objectFit: "fill",
              }}
              component="img"
              height="374"
              image={image?.original || image?.medium}
              alt="image"
            />
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default ShowsCard;
