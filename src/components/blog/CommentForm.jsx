import { Button, Container, TextField, Box } from "@mui/material";
import useBlogCall from "../../hooks/useBlogCall";
import { useState } from "react";

const CommentForm = ({ blogId, userId }) => {
  const { postComment } = useBlogCall();
  const [commentText, setCommentText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const commentData = {
      blogId: blogId,
      userId: userId,
      comment: commentText,
    };
    postComment("comments", commentData);
    console.log(commentData);

    setCommentText("");
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          backgroundColor: "primary.ligth",
          padding: 2,
          borderRadius: "12px",
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? "0 4px 12px rgba(0, 0, 0, 0.5)"
              : "0 4px 12px rgba(0, 0, 0, 0.1)",
          width: { xs: "70vw", md: "45vw" },
          marginLeft: { xs: "-.8rem", sm: 0 },
        }}
      >
        <TextField
          variant="outlined"
          multiline
          rows={6}
          placeholder="Write your comment here..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          sx={{
            borderRadius: "12px",
            backgroundColor: "primary.ligth",
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
            },
            "& .MuiInputBase-input": {
              padding: "1rem",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#ddd",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#bbb",
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          // color="secondary"
          sx={{
            alignSelf: "flex-end",
            borderRadius: "12px",
            padding: "0.75rem 1.5rem",
            textTransform: "none",
            fontWeight: "bold",
          }}
        >
          Add Comment
        </Button>
      </Box>
    </Container>
  );
};

export default CommentForm;
