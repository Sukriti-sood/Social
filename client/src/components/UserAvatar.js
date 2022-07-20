import { Avatar } from "@mui/material";
import React from "react";
import { useTheme } from "@emotion/react";

const UserAvatar = ({ username, height, width }) => {
  const theme = useTheme();
  return (
    <Avatar
      sx={{
        height: height,
        width: width,
        backgroundColor: theme.palette.primary.avatar,
      }}
      src={"https://avatars.dicebear.com/api/adventurer/" + username +".svg"}
    />
  );
};

export default UserAvatar;
