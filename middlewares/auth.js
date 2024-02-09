const jwt = require('jsonwebtoken')
const authorization = async(req, res, next) => {
    
    const token = req.cookies.access_token;
    console.log(token,"token");
    if (!token) {
      return res.json({status:403, message:"Unauthorized"})
    }
    try {
      const data = await jwt.verify(token, process.env.JWT_SECRET);
      
      console.log(data);
      req.email = data.email;
      req.id = data.id;
      return next();
    } catch {
      return res.json({status:403, message:"Unauthorized"});
    }
};

module.exports = {authorization}