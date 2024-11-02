const https = require("https");
const fs = require("fs");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authRouter = require("./routers/authRouter");
const instructorRouter = require("./routers/instructorRouter");
const applicationRouter = require("./routers/applicationRouter");
const studentRouter = require("./routers/studentRouter");
const lessonRouter = require("./routers/lessonRouter");
const imageRouter = require("./routers/imageRouter");
const adminRouter = require("./routers/adminRouter");
const PORT = process.env.PORT || 6002;

const app = express();

app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(
  cors({
    credentials: true,
    origin: [
      "https://driveculture.ru",
      "https://admin.driveculture.ru",
      "http://localhost:3000",
    ],
  })
);
app.use("/auth", authRouter);
app.use("/instructor", instructorRouter);
app.use("/application", applicationRouter);
app.use("/student", studentRouter);
app.use("/lesson", lessonRouter);
app.use("/image", imageRouter);
app.use("/admin", adminRouter);

const start = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://а:а@cluster0.4rclljs.mongodb.net/?retryWrites=true&w=majority`
    );
    https
      .createServer(
        {
          key: fs.readFileSync("key.pem"),
          cert: fs.readFileSync("cert.pem"),
        },
        app
      )
      .listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
