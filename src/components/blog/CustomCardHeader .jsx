import React from "react";
import { formatDateTime } from "../../helper/formatDate";

const CustomCardHeader = ({
  image: userImage,
  firstName,
  lastName,
  createdAt,
}) => {
  return (
    <div className="flex items-center space-x-3 p-4">
      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
        {userImage ? (
          <img src={userImage} alt="user" className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-600 font-semibold">
            {firstName?.charAt(0) || lastName?.charAt(0) || "R"}
          </span>
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-bold text-gray-900">
          {firstName} {lastName}
        </span>
        <span className="text-xs text-gray-500">
          {formatDateTime(createdAt)}
        </span>
      </div>
    </div>
  );
};

export default CustomCardHeader;
