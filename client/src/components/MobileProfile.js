import { useTheme } from "@emotion/react";
import {
  Button,
  Card,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import { getFollowing, followUser, unfollowUser, getFollowers } from "../api/users";
import { isLoggedIn } from "../helpers/authHelper";
import ContentUpdateEditor from "./ContentUpdateEditor";
import UserAvatar from "./UserAvatar";
import HorizontalStack from "./util/HorizontalStack";

const MobileProfile = (props) => {
  const [user, setUser] = useState(null);
  const currentUser = isLoggedIn();
  const theme = useTheme();
  const iconColor = theme.palette.primary.main;
  const [isfollowing, setFollowing] = useState(false)
  const [followers, setFollowers] = useState([]);
  const [following, setFollowingData] = useState([]);

  useEffect(() => {
    if (props.profile) {
      setUser(props.profile.user);
    }
  }, [props.profile]);
  useEffect(()=>{
    const isFollowing = async(value) => {
      const res = await getFollowing(value)
      if (!res.error) {
        let followingData = res.data;
        if(user){
        if(followingData && followingData.length>0){
            for(let User of followingData)
            {
              if(user._id===User.followingId)
              {
                setFollowing(true);
                break;
              }
            }
          }
      }
      }
    };
     if(user && currentUser){
      const data={"userId":currentUser.userId,}
      isFollowing(data)
    }
  },[user, currentUser])

  useEffect(()=>{
    const countFollowers = async(value)=>{
      const res = await getFollowers(value);
      if(!res.error)
      {
        let followerData = res.data;
        if(followerData)
        {
          setFollowers(followerData)
        }
      }
    }
    if(user)
    {
      const data = {"followingId":user._id}
      countFollowers(data);
    }
  },[user,isfollowing])

  useEffect(()=>{
    const countFollowing = async(value)=>{
      const res = await getFollowing(value);
      if(!res.error)
      {
        let followingData = res.data;
        if(followingData)
        {
          setFollowingData(followingData)
        }
      }
    }
    if(user)
    {
      const data = {"userId":user._id}
      countFollowing(data);
    }
  },[user])

  const handleFollow = async () => {

    if(user)
    {
      const data = {"followingId":user._id,"userId":currentUser.userId}

      const res = await followUser(currentUser, data);

      if(!res.error)
      {
        if(res.result)
        {
          setFollowing(true)
        }
      }
    }

  }

  const handleunFollow = async () => {

    if(user)
    {
      const data = {"followingId":user._id,"userId":currentUser.userId}

      const res = await unfollowUser(currentUser, data);

      if(!res.error)
      {
        if(res.result)
        {
          setFollowing(false)
        }
      }
    }

  }
  return (
    <Card sx={{ display: { sm: "block", md: "none" }, mb: 2 }}>
      {user ? (
        <Stack spacing={2}>
          <HorizontalStack spacing={2} justifyContent="space-between">
            <HorizontalStack>
              <UserAvatar width={50} height={50} username={user.username} />
              <Typography variant="h6" textOverflow="ellipses">
                {user.username}
              </Typography>
            </HorizontalStack>

            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <HorizontalStack spacing={3}>
                <Stack alignItems="center">
                  <Typography>Likes</Typography>
                  <Typography color="text.secondary">
                    <b>{props.profile.posts.likeCount}</b>
                  </Typography>
                </Stack>
                <Stack alignItems="center">
                  <Typography color="text.secondary">Posts</Typography>
                  <Typography color="text.secondary">
                    <b>{props.profile.posts.count}</b>
                  </Typography>
                </Stack>
                <Stack alignItems="center">
                  <Typography color="text.secondary">Following</Typography>
                  <Typography color="text.secondary">
                    <b>{following.length}</b>
                  </Typography>
                </Stack>
                <Stack alignItems="center">
                  <Typography color="text.secondary">Followers</Typography>
                  <Typography color="text.secondary">
                    <b>{followers.length}</b>
                  </Typography>
                </Stack>
              </HorizontalStack>
            </Box>
          </HorizontalStack>
          <Divider />
          <Box>
            {currentUser && user._id === currentUser.userId && (
              <IconButton onClick={props.handleEditing} sx={{ mr: 1 }}>
                {props.editing ? (
                  <MdCancel color={iconColor} />
                ) : (
                  <AiFillEdit color={iconColor} />
                )}
              </IconButton>
            )}
            {user.biography ? (
              <>
                <Typography textAlign="center" variant="p">
                  <b>Bio: </b>
                  <div className="ql-editor" dangerouslySetInnerHTML={{ __html: user.biography }}/>
                </Typography>
              </>
            ) : (
              <Typography variant="p">
                <i>
                  No bio yet{" "}
                  {currentUser && user._id === currentUser.userId && (
                    <span>- Tap on the edit icon to add your bio</span>
                  )}
                </i>
              </Typography>
            )}
            {currentUser && user._id !== currentUser.userId && (
              <Box sx={{ mt: 2 }}>
            <HorizontalStack>
            <Button variant="outlined" onClick={props.handleMessage}>
            Message
            </Button>
            {isfollowing? <Button variant="contained" onClick={handleunFollow}>
            Unfollow
            </Button>: <Button variant="contained" onClick={handleFollow}>
            Follow
            </Button>}
            </HorizontalStack>
              </Box>
            )}
            {props.editing && (
              <Box>
                <ContentUpdateEditor
                  handleSubmit={props.handleSubmit}
                  originalContent={user.biography}
                  validate={props.validate}
                  placeholder={"Edit your Bio"}
                />
              </Box>
            )}
          </Box>
        </Stack>
      ) : (
        <>Loading...</>
      )}
    </Card>
  );
};

export default MobileProfile;
