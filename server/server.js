const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
const { authSocket, socketServer } = require("./socketServer");
const posts = require("./routes/posts");
const users = require("./routes/users");
const comments = require("./routes/comments");
const messages = require("./routes/messages");

const {PORT, DB_NAME, MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT} = require("./config/config")

dotenv.config();

const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

io.use(authSocket);
io.on("connection", (socket) => socketServer(socket));

const MONGO_URI = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

// mongoose.connect(
//   `${MONGO_URI}`,
//   { dbName: DB_NAME, useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true },
//   () => {
//     console.log("MongoDB connected");
//   }
// );

const connectWithRetry = () => {
  mongoose
    .connect(MONGO_URI, {
      dbName:"socialDB",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("succesfully connected to DB"))
    .catch((e) => {
      console.log(e);
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

app.get("/api/", (req, res) => {
  res.send("<h2>Social Backend Running</h2>");
});

httpServer.listen(PORT || 4000, () => {
  console.log("Listening");
});

app.use(express.json());
app.use(cors());
app.use("/api/posts", posts);
app.use("/api/users", users);
app.use("/api/comments", comments);
app.use("/api/messages", messages);

// if (process.env.NODE_ENV == "production") {
//   app.use(express.static(path.join(__dirname, "/client/build")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "client/build", "index.html"));
//   });
// }
