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

const defaultImage =
  "https://t3.ftcdn.net/jpg/03/27/55/60/360_F_327556002_99c7QmZmwocLwF7ywQ68ChZaBry1DbtD.jpg";

const NewsCard = ({ title, url, image, content, publishedAt, source }) => {
  const { currentUser } = useSelector((state) => state.auth);
  const handleReadMore = () => {
    if (!currentUser) {
      toastWarnNotify("You must Login");
    } else {
      window.open(url, "_blank");
    }
  };

  const splittedContent = content.split("[")[0];

  return (
    <Container
      maxWidth="xl"
      sx={{ backgroundColor: "neutral.dark", paddingBottom: "2rem" }}
    >
      <PageHeader text="News" />
      <Card
        sx={{
          height: { xs: 650, md: 400 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
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
              justifyContent: "space-around",
              my: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                paddingX: "1.5rem",
              }}
            >
              <Typography sx={{ fontWeight: "bold" }}>
                📰 {source.name}
              </Typography>
              <Typography>
                {` ${new Date(publishedAt).toLocaleDateString("de-DE")}`}
              </Typography>
            </Box>
            <CardHeader
              sx={{
                // color: "gray",
                "& .MuiTypography-root": {
                  fontSize: 15,
                  fontWeight: "bold",
                },
              }}
              title={title}
            />

            <CardContent>
              <Typography
                variant="body2"
                sx={{
                  // maxHeight: "100px",
                  marginTop: { xs: "-1rem", md: "-3rem" },
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: "3",
                  WebkitBoxOrient: "vertical",
                }}
              >
                {splittedContent || "No description available."}
              </Typography>
            </CardContent>
            <Typography
              onClick={handleReadMore}
              sx={{
                marginRight: "2rem",
                marginBottom: { md: "-1rem" },
                marginLeft: "auto",
                display: "flex",
                gap: 1,
                cursor: "pointer",
              }}
            >
              Read More <MdArrowOutward style={{ marginTop: ".3rem" }} />
            </Typography>
          </Grid>
          <Grid
            item
            sm={12}
            md={6}
            // order={{ xs: 1, md: 2 }}
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
              image={image ? image : defaultImage}
              alt="image"
            />
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default NewsCard;
