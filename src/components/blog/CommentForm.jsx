import { Button, Container, TextField, Box, Input } from "@mui/material";
import useBlogCall from "../../hooks/useBlogCall";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toastWarnNotify } from "../../helper/ToastNotify";

const CommentForm = ({ blogId, userId }) => {
  const { postComment } = useBlogCall();
  const [commentText, setCommentText] = useState("");
  const [showCommentField, setShowCommentField] = useState(false);
  const { currentUser } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      toastWarnNotify(
        "You need to be logged in to like this blog. Please sign in or register."
      );
      return;
    }

    const commentData = {
      blogId: blogId,
      userId: userId,
      comment: commentText,
    };

    // Set a loading state or similar indicator if needed
    // setLoading(true);

    try {
      const success = await postComment("comments", commentData);

      if (success) {
        setCommentText(""); // Clear the comment text if successful
        setShowCommentField(false); // Hide the comment field if successful
      }
    } catch (error) {
      // Handle any additional errors if needed
      console.error("Error posting comment:", error);
    } finally {
      // Reset any loading states or similar indicators if used
      // setLoading(false);
    }
  };

  const handleCancel = () => {
    setCommentText("");
    setShowCommentField(false);
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
        {!showCommentField && (
          <Input
            sx={{ fontWeight: "bold" }}
            placeholder="Write your comment here..."
            onClick={() => setShowCommentField(true)}
            fullWidth
          />
        )}
        {showCommentField && (
          <>
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
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleCancel}
                sx={{
                  borderRadius: "12px",
                  padding: "0.75rem 1.5rem",
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  borderRadius: "12px",
                  padding: "0.75rem 1.5rem",
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                Save
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default CommentForm;
