const jwt = require('jsonwebtoken');


const checkToken = async function(req, res, next){
  try {

    var tokenBearer = req.headers.authorization;
    if(!req.headers.authorization){
      throw {message: "There is no auth header on this request", code: 400}

    }
    var split = tokenBearer.split(' ');
    var token = split[1];

    var isValid = await jwt.verify(token, process.env.JWT_SECRET);

    if(isValid){
      next();
    } else{
      throw {message: "You do not have permission to access this data.", code: 401}
    }
  } catch(error){
    res.send({error: `${error}`})
  }
}

module.exports = checkToken;