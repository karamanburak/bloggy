import React from "react";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";
import { Box, Typography } from "@mui/material";

const CustomCardHeader = ({
  image: userImage,
  firstName,
  lastName,
  createdAt,
}) => {
  return (
    <CardHeader
      sx={{
        "& .MuiTypography-root": {
          fontSize: 15,
          fontWeight: "bold",
        },
        "& .MuiCardHeader-subheader": {
          display: { xs: "none", sm: "block" },
        },
      }}
      avatar={
        <Avatar aria-label="recipe">
          {userImage ? (
            <img src={userImage} alt="user" style={{ width: "100%" }} />
          ) : (
            "R"
          )}
        </Avatar>
      }
      title={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Typography>{firstName}</Typography>
          <Typography>{lastName}</Typography>
        </Box>
      }
      subheader={` ${new Date(createdAt).toLocaleDateString("de-DE")}`}
    />
  );
};

export default CustomCardHeader;
