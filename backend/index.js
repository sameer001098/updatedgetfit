const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const liveCommentsRoutes = require("./routes/comments");
const likes = require('./routes/likes');
const videoPosts = require('./routes/Podcast'); 
const register = require('./routes/register')
const questions = require('./routes/questions')
const property = require('./routes/property')

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/comments", liveCommentsRoutes);
app.use("/api/likes", likes);
app.use("/api/podcasts", videoPosts);
app.use("/api/register", register);
app.use("/api/questions", questions);
app.use("/api/property", property);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
