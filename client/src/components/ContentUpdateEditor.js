import { Box, Button, Stack } from "@mui/material";
import Editor from "./Editor"
import React, { useState } from "react";

const ContentUpdateEditor = (props) => {
  const [content, setContent] = useState(props.originalContent);
  const [error, setError] = useState("");

  const handleChange = (html) => {
    setContent(html);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.editorContent= content
    const cont = e.editorContent;
    let error = null;

    if (props.validate) {
      error = props.validate(cont);
    }

    if (error && error.length !== 0) {
      setError(error);
    } else {
      props.handleSubmit(e);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack>
        <Editor handleChange={handleChange} editorHtml={content} placeholder={props.placeholder?props.placeholder:"Update your Post"}/>
        <Button
          type="submit"
          variant="outlined"
          sx={{ backgroundColor: "white", mt: 1 }}
        >
          Update
        </Button>
      </Stack>
    </Box>
  );
};

export default ContentUpdateEditor;
