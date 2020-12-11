const express = require('express');
const router = express.Router();
const User = require("../models/user");
const errorCheck = require('../util/errorCheck');
const checkToken = require('../util/checkToken');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



router.get('/', errorCheck(async(req, res) => {
  console.log("route hit")
  let user = await User.find();
  if(user.length == 0){
    throw {message: "Failed to find any users.", code: 204 }
  }
  res.send(user);
}))

router.post('/register', errorCheck(async(req, res) => {
  //check to see if the user already exists
  let userExists = await User.findOne({username: req.body.username});
  if(userExists != null){
    throw {message: "There is already a user with this username.", code: 200 }
  }

  let emailExists = await User.findOne({email: req.body.email});
  if(emailExists != null){
    throw {message: "There is already an account registered with this email address.", code: 200 }
  }

  //hash the new users password
  let saltValue = await bcrypt.genSaltSync(10);
  let hashed = await bcrypt.hashSync(req.body.password, saltValue);

  //create new user object
  let newUser = new User({
    dateJoined: Date.now(),
    username: req.body.username,
    password: hashed,
    email: req.body.email
  });
  let saveUser = await newUser.save();
  if(!saveUser){
    throw {message: "There was a problem registering your account.", code: 500 }
  }
  res.send(saveUser);

}))

router.post('/login', errorCheck(async(req, res) => {
  //check to see if the user exists in db
  let user = await User.findOne({username: req.body.username});
  if(!user){
    throw {message: "There is no user found with this username.", code: 200 }
  }

  //check to see if the users password is correct
  let correctPassword = await bcrypt.compareSync(req.body.password, user.password);
  if(!correctPassword){
    throw {message: "Incorrect password entered.", code: 400 }
  }

  //author them a JWT token to request resources
  let token = await jwt.sign({username: user.username}, process.env.JWT_SECRET, {expiresIn: '30m'});
  res.status(200).json({
    token: token
  })
}))

router.get('/secure', checkToken, errorCheck(async(req, res)=> {
  console.log("route hit")
  res.send('You used a token to get this resoruce!')
}))






module.exports = router;
