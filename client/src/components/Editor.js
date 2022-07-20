import React from "react";
import ReactQuill, {Quill} from 'react-quill';
import ImageUploader from "quill-image-uploader";
import "./editor.css"
import axios from 'axios';
import quillEmoji from "quill-emoji";
import { ImageResize } from "./ImageResize";
import 'react-quill/dist/quill.snow.css';
import { Video } from "./quill-video-resize";
import "./quill-video-resize.css";
const { EmojiBlot, ShortNameEmoji, ToolbarEmoji, TextAreaEmoji } = quillEmoji;


Quill.register("modules/imageUploader", ImageUploader);
Quill.register("modules/imageResize", ImageResize);
Quill.register({
  "formats/video": Video,
  "formats/emoji": EmojiBlot,
  "modules/emoji-shortname": ShortNameEmoji,
  "modules/emoji-toolbar": ToolbarEmoji,
  "modules/emoji-textarea": TextAreaEmoji
});
// create new Quill instance here...

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
    [{ color: [] }, { background: [] }], // dropdown with defaults from theme

    [{ align: [] }],
    ["emoji"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" }
    ],
    [{ direction: "rtl" }],
    ["link", "image", "video"],
    ["clean"]
  ],
  clipboard: {
    matchVisual: false
  },
  history: {
    delay: 1000,
    maxStack: 50,
    userOnly: false
  },
  imageUploader: {
    upload: async (file) => {
      const bodyFormData = new FormData();
      bodyFormData.append("image", file);
      const response = await axios({
        method: "post",
        url:
          `https://api.imgbb.com/1/upload?key=${process.env.REACT_APP_API_KEY_IMGBB}`,
        data: bodyFormData,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      return response.data.data.url;
    }
  },
  imageResize: {
    displayStyles: {
      backgroundColor: "black",
      border: "none",
      color: "white"
    },
    modules: ["Resize", "DisplaySize", "Toolbar"]
  },
  "emoji-toolbar": true,
  "emoji-textarea": true,
  "emoji-shortname": true
};
const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "code-block",
  "color",
  "background",
  "font",
  "align",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
  "clean",
  "code",
  "emoji"
];

const Editor = ({handleChange,editorHtml,placeholder}) =>{

    // const modules = {
    //     toolbar: [
    //       [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
    //       [{size: []}],
    //       ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    //       [{'list': 'ordered'}, {'list': 'bullet'}, 
    //        {'indent': '-1'}, {'indent': '+1'}],
    //       ['link', 'image', 'video'],
    //       ['clean']
    //     ],
    //     clipboard: {
    //       // toggle to add extra line breaks when pasting HTML:
    //       matchVisual: false,
    //     }
    //   }
    //   /* 
    //    * Quill editor formats
    //    * See https://quilljs.com/docs/formats/
    //    */
    // const formats = [
    //     'header', 'font', 'size',
    //     'bold', 'italic', 'underline', 'strike', 'blockquote',
    //     'list', 'bullet', 'indent',
    //     'link', 'image', 'video'
    //   ]
      

    return (
        <ReactQuill 
          theme="snow"
          onChange={handleChange}
          value={editorHtml}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
         >
        </ReactQuill>
    )
}

export default Editor