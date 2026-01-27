const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.js");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
connectDB();

app.get("/", (req, res) => {
  res.send("Bakend is running");
});
app.use("/api/user/firebase-auth", require("./routes/auth.routes.js"));
app.use("/api/resumes", require("./routes/resume.routes.js"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
