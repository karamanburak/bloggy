import React from "react";

const Avatar = ({ name, size = 96, className = "", gender = "neutral" }) => {
  if (!name) {
    return (
      <div
        className="bg-gray-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
        style={{ 
          width: `${size}px`, 
          height: `${size}px`, 
          fontSize: `${size * 0.4}px`
        }}
      >
        ?
      </div>
    );
  }

  // Generate seed from name for consistent avatar
  const seed = name.toLowerCase().replace(/\s+/g, '-');
  
  // Use adventurer style for 3D realistic avatars
  // This style includes both male and female characters
  const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}&size=${size}`;

  return (
    <img
      src={avatarUrl}
      alt={`${name} avatar`}
      className={`rounded-full object-cover ${className}`}
      style={{ 
        width: `${size}px`, 
        height: `${size}px`
      }}
      loading="lazy"
    />
  );
};

export default Avatar;

