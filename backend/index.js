const express = require("express");
const bodyParser = require("body-parser");
const database = require("./database");

const cors = require("cors");
const cookieParser = require("cookie-parser");
const Joke = require("./models/Joke");

require("dotenv").config();

const app = express();

app.set("trust proxy", true);

app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://zens-frontend.vercel.app/", "https://zens-backend-so35.onrender.com/"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(express.json({ limit: "30mb" }));
app.use(express.static("public"));

app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "30mb" }));

app.get("/v1/get-jokes", async (req, res) => {
  try {
    const jokes = await Joke.find();
    res.status(200).send({ jokes });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.patch("/v1/:id/rate-joke", async (req, res) => {
  try {
    let updateField = {};

    if (req.body?.type === "funny") {
      updateField = {
        funnyRate: 1,
      };
    } else {
      updateField = {
        notFunnyRate: 1,
      };
    }

    await Joke.updateOne(
      {
        _id: req.params.id,
      },
      {
        $inc: updateField,
      }
    );
    res.status(200).send({ message: "Rate Success." });
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(process.env.PORT, function () {
  console.log("Starting at port " + process.env.PORT);
});
