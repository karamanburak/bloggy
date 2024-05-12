import { Button } from "@mui/material";
import React from "react";

const PageHeader = ({text}) => {
  return(
    <Button sx={{color:"neutral.light",fontWeight:"bold", fontSize:"1.2rem", marginLeft:"1rem"}}>
        {text}
    </Button>
  )
}
export default PageHeader;
