import React from "react";

const PageHeader = ({text}) => {
  return(
    <button className="text-gray-100 font-bold text-xl ml-4 hover:text-gray-200 transition-colors">
      {text}
    </button>
  )
}
export default PageHeader;
