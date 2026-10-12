const jwt = require("jsonwebtoken");
const User = require("../models/admin.model");

async function teacherAuth (req, res, next) {
  // console.log(req.cookie)
  const token = req.cookies.token;
      if (!token) {
    return res.status(401).json({
      message: "unauthorized",
    });
  }
  try {

    const decoded = jwt.verify(token,process.env.JWT_SECRECT);
// console.log(decoded)
    const user = await User.findById(decoded.id).populate("subjectIds courseIds")
    // console.log(user)
// await  user.populate("courseId")
    if ( !user || user.role !== "teacher") {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    req.user = user;

    next();

  } catch (error) {

    res.status(401).json({
      message: "Invalid token"
      ,error
    });
  }
};

module.exports = teacherAuth;