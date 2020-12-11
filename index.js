const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 3000;
const dbUrl = process.env.DB_URL;

//@@ CORS setup
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Authorization");
  next();
});

//@@ Other setup
require('dotenv').config();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//@@ Route naming
app.use('/api/users', require('./routes/users'));



async function start(){
  try {
    await mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`Connected to mongodb @ ${dbUrl}`)

    app.listen(port, () => {
      console.log(`Application started on port:${port}`)
    })

  }catch(err){
    console.log(err);
  }
}

start();