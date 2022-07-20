import "@mui/material";
import "react-icons";
import "react-icons/bi";
import "react-icons/md";
import "react-icons/bs";
import "react-router-dom";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import {
  BrowserRouter,
  Route,
  Routes,
  // useParams,
  // useSearchParams,
} from "react-router-dom";
// import theme from "./theme";

import PostPage from "./components/pages/PostPage";
import CreatePostPage from "./components/pages/CreatePostPage";
import ProfilePage from "./components/pages/ProfilePage";
import LoginPage from "./components/pages/LoginPage";
import ForgetPage from "./components/pages/ForgetPage"
import SignupPage from "./components/pages/SignupPage";
import ExplorePage from "./components/pages/ExplorePage";
import PrivateRoute from "./components/PrivateRoute";
import SearchPage from "./components/pages/SearchPage";
import MessengerPage from "./components/pages/MessengerPage";
import { initiateSocketConnection,  } from "./helpers/socketHelper";
import { createTheme } from "@mui/material";
// import Roboto1 from "./fonts/Roboto-Regular.ttf"
import Bobcat from "./fonts/LDFComicSans.ttf"
import { createContext, useMemo, useState } from "react";
import { grey } from "@mui/material/colors";
// import socket from "./helpers/socketHelper";
// import { BASE_URL } from "./config";
// import { io } from "socket.io-client";


export const ColorModeContext = createContext({ toggleColorMode: () => {} })
function App() {
  const [mode, setMode] = useState("dark")
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );


  const theme = useMemo(
    () => 
    createTheme({
      palette:{
        mode,
        primary:{
          main: '#8e65c6',
          avatar:'#c5d1fd',
          likebox: mode==="light"?"#dce1f3":"#49474a",
          meesageColor: mode==="light"?"grey.100":"#9175b7",
          comment: mode==="light"?"grey.100":"#49474a",
          commentDepth: mode==="light"?"#ffffff":"#000"
        },
        background: {
          default: "#c3bfc7"
        },
        action:{
          hover:mode==="light"?"#b2a5c3":"#8e65c6"
        }
      },
      typography:{
        "fontFamily": "Bob"
      },
      components: {
        MuiCard: {
          defaultProps: {
            variant: "outlined",
          },
          styleOverrides: {
            root: ({ ownerState, theme }) => ({
              ...{
                padding: theme.spacing(2),
                borderWidth: "1.5px",
              },
            }),
          },
        },
        MuiContainer: {
          defaultProps: {
            maxWidth: "md",
          },
        },
        MuiCssBaseline: {
          styleOverrides:`
          @font-face {
            font-family: 'Bob';
            font-style: normal;
            font-display: swap;
            font-weight: 400;
            src: local('Bob'), local('Bobcat'), url(${Bobcat}) format('truetype');
            unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
          }
        `
        }
      },
    
    }),[mode],
    );
  initiateSocketConnection();

  return (
    <ColorModeContext.Provider value={colorMode}>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<ExplorePage />} />
          <Route path="/posts/:id" element={<PostPage />} />
          <Route
            path="/posts/create"
            element={
              <PrivateRoute>
                <CreatePostPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/messenger"
            element={
              <PrivateRoute>
                <MessengerPage />
              </PrivateRoute>
            }
          />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/users/:id" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forget" element={<ForgetPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
    </ColorModeContext.Provider>
  
  );
}

export default App;
