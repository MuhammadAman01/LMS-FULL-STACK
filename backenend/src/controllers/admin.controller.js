// const { JsonWebTokenError } = require("jsonwebtoken")
const adminModel=require("../models/admin.model")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const courseModel = require("../models/course.model")
const subjectModel = require("../models/subject.model")
async function registerAdmin(req,res) {
    console.log("aha")
    const {email,pass,name,role}=req.body
const isUserExist=await adminModel.findOne({
    $or:[
{email},
    ]
})

if(isUserExist){
return res.status(400).json({
    msg:"user already exist",
    data:isUserExist
})
}
 const hash=await bcrypt.hash(pass,10)
 
console.log(hash)
const user=await adminModel.create({
    email,
    password:hash,
    name,
    role

})
  const token=  jwt.sign({
    id:user._id
   },process.env.JWT_SECRECT)
console.log(token)
res.cookie("token",token)



    res.status(200).json({
        msg:"user register sucesfuly ",
        user,
        token
    })
}

async function loginAdmin(req,res){
const {email,password}=req.body

const isUserExist=await adminModel.findOne({
    email
})
// console.log(isUserExist._id)
if(!isUserExist){
    return  res.status(401).json({
            message: "invalid credientials",
        });
}
   const valid=await bcrypt.compare(password,isUserExist.password)
   console.log(valid)
if(!valid){
    return  res.status(401).json({
            message: "invalid credientials",
        });
}

const token= await jwt.sign({
    id:isUserExist._id
},process.env.JWT_SECRECT)
// console.log(token)
res.cookie("token",token)

res.send({
   message:"use login sucesfuly",
   isUserExist
})


}


async function adminDashboard(req,res) {
 const totalTeachers = await adminModel.countDocuments({
    role: "teacher"
});
const totalStudent = await adminModel.countDocuments({
    role: "student"
});


const totalCourses = await courseModel.countDocuments();
const totalSubj = await subjectModel.countDocuments();

    res.status(200).send({
        msg:"this is dashboard",
        totalTeachers,
       totalStudent,
       totalCourses,
       totalSubj

    })
}

async function getProfile(req, res) {
    try {
        const admin = req.user;

        res.status(200).json({
            msg: "Admin profile fetched successfully",
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        res.status(500).json({
            msg: "Server error",
            error: error.message
        });
    }
}
async function adminLogout (req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Admin logged out successfully",
    });
  } catch (error) {
    console.log("Admin Logout Error:", error);

    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};



module.exports={registerAdmin,loginAdmin,adminDashboard,getProfile,adminLogout}