import { Typography } from "@mui/material";
import React from "react";

const PageHeader = ({text}) => {
  return(
    <Typography sx={{color:"neutral.light",fontWeight:"bold", fontSize:"1.2rem"}}>
        {text}
    </Typography>
  )
}
export default PageHeader;
