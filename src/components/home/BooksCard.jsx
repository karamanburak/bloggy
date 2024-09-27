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
import { MdArrowOutward } from "react-icons/md";

const defaultImage =
  "https://images.unsplash.com/photo-1581905764498-f1b60bae941a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80";

const BooksCard = ({
  amazon_product_url,
  author,
  book_image,
  description,
  title,
}) => {
  const handleReadMore = () => {
    window.open(amazon_product_url, "_blank");
  };

  return (
    <Container maxWidth="lg" sx={{ paddingBottom: "2rem" }}>
      <PageHeader text="Books" />
      <Card
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          borderRadius: "16px",
          boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
          overflow: "hidden",
          padding: "1rem",
          backgroundColor: "#f9f9f9",
          border: "1px solid #e0e0e0",
          position: "relative",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 2,
            }}
          >
            <CardMedia
              component="img"
              image={book_image || defaultImage}
              alt={`image for ${title}`}
              sx={{
                width: "100%",
                // maxWidth: "400px",
                height: "350px",
                borderRadius: "12px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                objectFit: "fill",
              }}
            />
          </Grid>
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
                  mb: 1,
                  color: "#333",
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  color: "#555",
                }}
              >
                {author}
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
                  color: "#666",
                }}
              >
                {description}
              </Typography>
            </Box>
            <Typography
              onClick={handleReadMore}
              sx={{
                alignSelf: "flex-end",
                textTransform: "none",
                cursor: "pointer",
              }}
            >
              Read More <MdArrowOutward style={{ marginLeft: ".5rem" }} />
            </Typography>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default BooksCard;
