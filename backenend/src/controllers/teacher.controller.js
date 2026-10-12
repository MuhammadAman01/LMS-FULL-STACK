const adminModel=require("../models/admin.model")
const bcrypt=require("bcryptjs")

async function createTeacher(req,res) {
  // console.log
const {email,name,password,role="teacher",courseIds,subjectIds}=req.body
const isTeacherExist=await adminModel.findOne({
    email
})
if(isTeacherExist){
return res.send({
    msg:"teacher exist already"
})
}


const hash=await bcrypt.hash(password,10)
    const teacher=await adminModel.create({
        email,
        name,
        password:hash,
        role ,
        courseIds,
        subjectIds
    })

await teacher.populate("courseIds subjectIds")
    res.status(200).json({
        msh:"teacher created sucesfuly",
        teacher
    })



}
async function deleteTeacher(req,res) {
   const id= req.params.id

   console.log(id)
  const deletedUser = await adminModel.findOneAndDelete({
    _id: id,
    role: "teacher"
});
console.log(deletedUser)
 if (deletedUser==null){
    return res.send({
        msg:" teacher doest not exist"
    })
 }

return res.send({
    msg:"teacher deleted sucesfuly",
    deletedUser
})


}
async function updateTeacher(req,res) {

  const {email,name,courseIds,subjectIds}= req.body

  const isExistAlready=await adminModel.findOne({
    email,
    _id: { $ne: req.params.id }
  })

  if(isExistAlready){

    return res.send({
      msg:"teacher alredy exist with this email"
    })

  }

  const id= req.params.id

  const user=await adminModel.findOneAndUpdate({

    _id:id,

    role:"teacher"

  },{
    email,
    name,
    courseIds,
    subjectIds
  },{new:true})

  console.log(user)

  if(!user){

    return res.send({
      msh:"teacher does not exist"
    })

  }

  return res.send({

    msg:"teacher updated sucesfully",
    user

  })

}
async function getAllTeacher(req,res){
 const allTeachers = await adminModel.find({
  role: "teacher"
})
.select("-password")
.populate("courseIds")
.populate("subjectIds").sort({_id:-1})
  if(allTeachers.length==0){
return res.send({
    msg:"no teacher exist",
    allTeachers
})
}  
res.send({
    msg:"teacher fetched sucesfuly",
    teachers:allTeachers
  })
}
module.exports={createTeacher,deleteTeacher,updateTeacher,getAllTeacher}