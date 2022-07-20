import { useTheme } from "@emotion/react";
import {
  Button,
  Card,
  Stack,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { isLoggedIn } from "../helpers/authHelper";
import { getFollowing, followUser, unfollowUser, getFollowers } from "../api/users";
import ContentUpdateEditor from "./ContentUpdateEditor";
import Loading from "./Loading";
import UserAvatar from "./UserAvatar";
import HorizontalStack from "./util/HorizontalStack";

const Profile = (props) => {
  const [user, setUser] = useState(null);
  const [isfollowing, setFollowing] = useState(false)
  const [followers, setFollowers] = useState([]);
  const [following, setFollowingData] = useState([]);
  const currentUser = isLoggedIn();
  const theme = useTheme();
  const iconColor = theme.palette.primary.main;

  useEffect(() => {
    if (props.profile) {
      setUser(props.profile.user);
    }
  }, [props.profile]);


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
    <Card>
      {user ? (
        <Stack alignItems="center" spacing={2}>
          <Box my={1}>
            <UserAvatar width={150} height={150} username={user.username} />
          </Box>

          <Typography variant="h5">{user.username}</Typography>

          {props.editing ? (
            <Box>
              <ContentUpdateEditor
                handleSubmit={props.handleSubmit}
                originalContent={user.biography}
                validate={props.validate}
                placeholder={"Edit your Bio"}
              />
            </Box>
          ) : user.biography ? (
            <Typography textAlign="center" variant="p">
              <b>Bio: </b>
              <div className="ql-editor" dangerouslySetInnerHTML={{ __html: user.biography }}/>
            </Typography>
          ) : (
            <Typography variant="p">
              <i>No bio yet</i>
            </Typography>
          )}

          {currentUser && user._id === currentUser.userId && (
            <Box>
              <Button
                startIcon={<AiFillEdit color={iconColor} />}
                onClick={props.handleEditing}
              >
                {props.editing ? <>Cancel</> : <>Edit bio</>}
              </Button>
            </Box>
          )}

          {currentUser && user._id !== currentUser.userId && (
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
          )}

          <HorizontalStack>
            <Typography color="text.secondary">
              Likes <b>{props.profile.posts.likeCount}</b>
            </Typography>
            <Typography color="text.secondary">
              Posts <b>{props.profile.posts.count}</b>
            </Typography>
          </HorizontalStack>
          <HorizontalStack>
            <Typography color="text.secondary">
              Following <b>{following.length}</b>
            </Typography>
            <Typography color="text.secondary">
              Followers <b>{followers.length}</b>
            </Typography>
          </HorizontalStack>
        </Stack>
      ) : (
        <Loading label="Loading profile" />
      )}
    </Card>
  );
};

export default Profile;
