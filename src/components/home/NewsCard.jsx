import "react-slideshow-image/dist/styles.css";
import {
  Box,
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
    <Container maxWidth="lg" sx={{ paddingBottom: "2rem" }}>
      <PageHeader text="News" />
      <Card
        sx={{
          height: { xs: 750, md: 450 },
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
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "background.paper",
            }}
          >
            <CardMedia
              sx={{
                width: "100%",
                objectFit: "fill",
                borderRadius: "1rem",
              }}
              component="img"
              height="374"
              image={image ? image : defaultImage}
              alt="image"
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            order={{ xs: 1, md: 2 }}
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
                {source.name.toUpperCase()}
              </Typography>
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
                  color: "text.primary",
                  mb: 3,
                  display: "-webkit-box",
                  WebkitLineClamp: { xs: 4, md: 6 },
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {splittedContent || "No description available."}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: "auto",
              }}
            >
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {new Date(publishedAt).toLocaleDateString("de-DE")}
              </Typography>
              <Typography
                onClick={handleReadMore}
                sx={{
                  marginRight: "2rem",
                  marginLeft: "auto",
                  display: "flex",
                  gap: 1,
                  cursor: "pointer",
                }}
              >
                Read More <MdArrowOutward style={{ marginTop: ".3rem" }} />
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default NewsCard;
