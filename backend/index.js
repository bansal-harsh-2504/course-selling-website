import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

let users = [];
const app = express();
const JWT_SECRET = "ilovemyindia";

app.use(cors());
app.use(express.json());

function logger(req, res, next) {
    // console.log(req.socket.remoteAddress)
    console.log(users);
  console.log(req.method + " request received");
  next();
}

app.post("/signup", logger, (req, res) => {
  let { username, password } = req.body;
  if (users.find((user) => user.username == username)) {
    res.status(401).json({
      message: "Username already exists",
    });
  } else {
    users.push({
      username,
      password,
    });
    console.log(users);
    res.status(200).json({
      message: "Sign up successfull!",
    });
  }
});

app.post("/login", logger, (req, res) => {
  let { username, password } = req.body;
  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  if (user) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({
      message: token,
    });
  } else {
    res.status(400).json({
      message: "Invalid Credentials!",
    });
  }
});

function auth(req, res, next) {
  const token = req.headers.token;
  if (token) {
    try {
      const verified = jwt.verify(token, JWT_SECRET);
      req.username = verified.username;
      next();
    } catch (e) {
      return res.status(401).json({
        message: "User authentication failed!",
      });
    }
  } else {
    res.status(401).json({
      message: "No token Provided!",
    });
  }
}

app.get("/me", logger, auth, (req, res) => {
  const user = users.find((user) => user.username === req.username);

  if (user) {
    return res.status(200).json({
      message: "User details fetched successfully",
      username: user.username ,
      password: user.password,
    });
  } else {
    return res.status(404).json({
      message: "User not found!",
    });
  }
});

app.get("/logout", logger, (req, res) => {
  req.headers.token = "";
  return res.status(200).json({
    message: "Logged out successfully",
  });
});

app.listen(3000, () => {
  console.log("App is listening to port 3000");
});
