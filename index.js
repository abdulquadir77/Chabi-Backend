const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const connection = require("./Config/db");
const UserModel = require("./Models/user.model");
const ScoreModel = require("./Models/score.model");
const authentication = require("./Middlewares/authorization");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.send("Welcome To EVALUATION 4");
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const email_present = await UserModel.findOne({ email });

  if (email_present?.email) {
    res.send("Email Already Exist");
  } else {
    try {
      bcrypt.hash(password, 6, async (err, hash) => {
        const user = new UserModel({ email, password: hash });
        await user.save();
        res.send("SignUp Successfully");
      });
    } catch (error) {
      console.log("Somthing Error in Signup");
      console.log(error);
    }
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await UserModel.find({ email });
    if (user.length > 0) {
      const hashed_password = user[0].password;
      bcrypt.compare(password, hashed_password, function (err, result) {
        if (result) {
          const token = jwt.sign({ userID: user[0]._id }, "hush");
          res.send({ msg: "Login successfull", token: token });
        } else {
          res.send("Login failed");
        }
      });
    }
  } catch (error) {
    console.log("somthing Wrong in Login");
    console.log(error);
  }
});

app.post("/score", authentication, async (req, res) => {
  const score = req.body;
  try {
    let user_score = new ScoreModel(score);
    await user_score.save();
    res.send({ smg: user_score });
  } catch (error) {
    console.log(error);
    res.send("Somthing error in score function");
  }
});

app.get("/score", authentication, async (req, res) => {
  const { userID } = req.body;
  try {
    const user_score = await ScoreModel.findOne({ userID });
    res.send({ smg: user_score });
  } catch (error) {
    console.log(error);
    res.send("Somthing error in score function");
  }
});

app.patch("/score/:id", authentication, async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  try {
    const user_score = await ScoreModel.findByIdAndUpdate(
      id,
      { $set: payload },
      { new: true }
    );
    res.send({ smg: user_score });
  } catch (error) {
    console.log(error);
    res.send("Somthing error in score function");
  }
});

app.listen(8080, async () => {
  try {
    await connection;
    console.log("Connected With db");
  } catch (error) {
    console.log(error);
    console.log("Somthing Wrong in Server");
  }
  console.log("Listening on PORT 8080");
});
