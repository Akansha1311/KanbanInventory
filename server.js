//Environmental Variables
require("dotenv").config();
const PORT = process.env.PORT || 3000;

//Express
const express = require("express");
const app = express();

//http
const http = require("http").Server(app);

//Socket io
const io = require("socket.io")(http);

io.on("connection", (socket) => {
  socket.setMaxListeners(20);
  socket.on("workcycle complete", (msg) => {
    io.emit("workcycle complete", msg);
  });
  socket.on("dept completed", (msg) => {
    io.emit("dept completed", msg);
  });
  io.on("disconnect", () => {
    console.log("a user disconnected");
  });
});

//Web Push
const webPush = require("web-push");
const publicKey = process.env.PUBLIC_KEY;
const privateKey = process.env.PRIVATE_KEY;

webPush.setVapidDetails(
  "mailto: deepanchakravarthi434@gmail.com",
  publicKey,
  privateKey
);

//Sessions
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

let flash = require("connect-flash");

//Passport
const passport = require("passport");
require("./config/passport")(passport);

//MongoDB connection
let mongoose = require("mongoose");
const connectDB = require("./config/db");
connectDB();

//Setting the view engine
app.set("view engine", "ejs");

//Express Middlewares
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "SESSION_SECRET",
    saveUninitialized: true,
    resave: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use("/", require("./routes/index"));
// app.use("/fabric-inspection", require("./routes/fabric-inspection-board.js"));
app.use("/fabric-sourcing", require("./routes/fabric-sourcing"));
app.use(
  "/fabric-inspection-board",
  require("./routes/fabric-inspection-board")
);
app.use(
  "/available-fabrics-for-cutting",
  require("./routes/available-cutting-fabrics")
);
app.use("/cutting-cards", require("./routes/cutting-card"));
app.use("/cutting-board", require("./routes/cutting-board"));
// app.use("/rework-kanban-card", require("./routes/rework-kanban-card"));
app.use("/available-pieces", require("./routes/available-pieces"));
app.use("/notification-board", require("./routes/notification-board"));
// app.use("/analyze", require("./routes/analyse"));
app.use("/login", require("./routes/login"));
app.use("/logout", require("./routes/logout"));
app.use("/subscribe", require("./routes/subscribe"));

//To Register a new User
let User = require("./models/User");
let bcrypt = require("bcrypt");
let shortid = require("shortid");
app.post("/register", async (req, res) => {
  let username = req.body.name;
  let pass = req.body.pass;
  let newUser = {
    email: username,
    password: bcrypt.hashSync(pass, 10),
    id: shortid.generate(),
  };
  let createUser = await User.create(newUser);
  res.send("Success");
});

http.listen(PORT, console.log(`Server running on http://localhost:${PORT}`));
