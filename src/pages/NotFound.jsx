import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ErrorPage = () => {
  const [count, setCount] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => (prev === 0 ? prev : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  if (count === 0) {
    return <Navigate to="/" replace />;
  }
  return (
    <Box
      sx={{
        // position:"absolute", 
        // top:"50%", 
        // left:"50%", 
        // transform: "translate(-50%, -50%)", 
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        // backgroundColor: "primary.main",
        // color: "primary.main",
        height: "90vh"

      }}
    >
      <Typography variant="h5">
        404 Error
      </Typography>
      <Typography variant="h3">
        Page not found
      </Typography>
      <Typography variant="h6">
        Sorry, the page you are looking for could not be found or has been removed.
      </Typography>
      <Typography>
        Within <strong>{count}</strong> seconds, you will be redirected to
        the home page!
      </Typography>
    </Box>
  );
};

export default ErrorPage;


