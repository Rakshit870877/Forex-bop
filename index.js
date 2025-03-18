const express = require("express");
const bobRouter = require("./routes/bobRoutes");
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("app is working");
});
app.use("/bob", bobRouter);
app.listen(9000, () => {
  console.log("server is runnig");
});
