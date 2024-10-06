const express = require("express");
var mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const { PORT } = require('./config')
const { mongoURI } = require('./config')
// const morgan = require('morgan');
const userRoute = require("./routes/api/user");
const postRoute = require("./routes/api/post");

const app = express();

process.env.BASE_URL = 'http://localhost:8080/'

// Middleware
app.use(cors());
// app.use(bodyParser.json());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// app.use(morgan('tiny'))
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// API routes
app.use('/api/users', userRoute)
app.use('/api/posts', postRoute)

app.get("/", (req, res) => {
  res.send({ message: "Hello from the Express server!" });
});

// MongoDB Connection

mongoose.connect(mongoURI)
.then((db)=>{
  console.log("database connected successfully")
},(err)=>{
  return err
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
