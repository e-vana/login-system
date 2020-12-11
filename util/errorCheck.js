const errorCheck = fn =>
  (req, res) => {
      Promise.resolve(fn(req, res)).catch((error) => {
        if(!error.code){
          console.log(error);
          res.status(500).json({
            error: error.error
          })
        }else {
          res.status(error.code).json({
            // success: error.success,
            message: error.message,
          });
        }

    });
  }
module.exports = errorCheck