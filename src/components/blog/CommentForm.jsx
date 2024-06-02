import { Button, Container, FormControl, Input } from "@mui/material";
import useBlogCall from "../../hooks/useBlogCall";

const ariaLabel = { 'aria-label': 'description' };

const CommentForm = ({ blogId, onCommentSubmit,commentText, setCommentText }) => {
  const { postComment } = useBlogCall()


  const handleSubmit = (e) => {
    e.preventDefault();
    const commentData = {
      "blogId": blogId,
      "comment": commentText
    };
    postComment("comments", commentData);
    setCommentText("")
    onCommentSubmit()

  };


  return (
    <Container>
      <FormControl
        component="form"
        fullWidth
        variant="outlined"
        onSubmit={handleSubmit}
      >

        <Input sx={{ fontWeight: "bold" }} placeholder="Add Comment" inputProps={ariaLabel} value={commentText} onChange={(e) => setCommentText( e.target.value)} />
        <Button type="submit" variant="contained" sx={{ mt: 1, backgroundColor: "primary.light" }}>Add Comment</Button>
      </FormControl>
    </Container>
  )
};

export default CommentForm;
