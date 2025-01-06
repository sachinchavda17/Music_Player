const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const songRoutes = require("./routes/song");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = 8080;

app.use(cors());
// app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
try {
  mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to Mongo ! ");
    })
    .catch((err) => {
      console.error(`Error while connecting to mongo ${err} `);
      // return res.status(400).json({ err: err });
    });
} catch (error) {
  console.error(`Error while connecting to mongo ${err} `);
  // return res.status(400).json({ err: error });
}

app.get("/", (req, res) => {
  res.send("Server is running....");
});

app.use("/auth", authRoutes);
app.use("/song", songRoutes);

app.listen(port, () => {
  console.log("App is running on port " + port);
});
