import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { infoMessage } from "../../styles/globalStyles";

const Information = () => {
  const navigate = useNavigate();
  return (
    <Box
      backgroundColor="neutral.dark"
      sx={{
        marginTop: { xs: "6rem", md: "14.5rem" },
        padding: "2rem",
        borderRadius: "5px",
        height: "610px",
      }}
    >
      <Typography
        variant="h5"
        component="h1"
        marginBottom="1rem"
        color="secondary.light"
        fontWeight="bold"
      >
        INFORMATION
      </Typography>
      <Typography sx={infoMessage}>
        <strong>
          <i>On this blog site</i>
        </strong>
        , you can freely share your thoughts and get ideas by reading blogs on
        topics you are curious about. This blog site is created for everyone to
        express their ideas.
        <br />
      </Typography>
      <Typography
        sx={{
          ...infoMessage,
          "@media screen and (max-width: 320px)": {
            display: "none",
          },
        }}
      >
        These are the rules to be followed when using the site; <br />
        <strong>
          <i>1-)</i>
        </strong>{" "}
        When quoting from someone else's blog, reference should be given.
        <br />
        <strong>
          <i>2-)</i>
        </strong>{" "}
        Personal rights should be respected.
        <br />
        <strong>
          <i>3-)</i>
        </strong>{" "}
        Advertising content should not be written.
        <br />
        <strong>
          <i>Note:</i>
        </strong>{" "}
        Those who do not follow the rules will be banned from the site
        indefinitely.
      </Typography>
      <Box textAlign="center">
        <Button
          onClick={() => navigate("/login")}
          sx={{
            backgroundColor: "secondary.main",
            color: "white",
            "&:hover": {
              backgroundColor: "secondary.dark",
            },
          }}
        >
          Do You Have an Account ?
        </Button>
      </Box>
    </Box>
  );
};
export default Information;
