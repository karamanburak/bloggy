import React from "react";
import CardHeader from "@mui/material/CardHeader";
import Avatar from "@mui/material/Avatar";

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
      title={`${firstName} ${lastName} `}
      subheader={` ${new Date(createdAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })}`}
    />
  );
};

export default CustomCardHeader;
