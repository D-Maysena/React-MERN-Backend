const express = require("express");
require("dotenv").config();
const { dbConnection } = require("./database/config");
const cors = require("cors");
const path = require("path");

const app = express();

dbConnection();

app.use(cors());

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/events", require("./routes/events"));

app.use((req, res, next) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
  } else {
    next();
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Servidor escuchando en el puerto ${process.env.PORT}`);
});
