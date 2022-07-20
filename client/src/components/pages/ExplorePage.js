import {Container} from "@mui/material";
// import { Box } from "@mui/system";
import React from "react";
// import { getPosts } from "../../api/posts";
// import { isLoggedIn } from "../../helpers/authHelper";
// import CreatePost from "../CreatePost";
import GridLayout from "../GridLayout";
// import Loading from "../Loading";
import Navbar from "../Navbar";
// import SortBySelect from "../SortBySelect";
// import PostCard from "../PostCard";
import Sidebar from "../Sidebar";
// import HorizontalStack from "../util/HorizontalStack";
import PostBrowser from "../PostBrowser";
import "../../style.css"

const ExplorePage = () => {
  return (
    <Container>
      <Navbar />
      <GridLayout
        left={<PostBrowser createPost contentType="posts" />}
        right={<Sidebar />}
      />
    </Container>
  );
};

export default ExplorePage;
