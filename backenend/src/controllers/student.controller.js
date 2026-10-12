const adminModel=require("../models/admin.model")
const bcrypt=require("bcryptjs")

async function createStudent(req,res) {

const {email,name,password,role="student",courseIds,subjectIds}=req.body

const isExist=await adminModel.findOne({
    email
})
if(isExist){
    return res.send({
        msg:"this email already exist"
    })
}
const hash=await bcrypt.hash(password,10)
const student=await adminModel.create({
email,
name,
password:hash,
role,
courseIds,
subjectIds

})
await student.populate("courseIds")
    return res.status(200).json({
        msg:"student created sucesfuly",
        student
    })
}
async function deleteStudent(req,res){
const id=req.params.id
const deletedStudent=await adminModel.findOneAndDelete({
_id:id,
role:"student"
}) 
if (deletedStudent==null){
    return res.send({
        msg:" Student doest not exist"
    })
 }

    return res.send({
        msg:"student delete sucesfuly",
         student:deletedStudent
    })
}
async function updateStudent(req,res){

  const {email,name,courseIds,subjectIds}=req.body;

  const id=req.params.id;

  const isExistAlready=await adminModel.findOne({
    email,
    _id: { $ne: id }
  });

  if(isExistAlready){

    return res.send({
      msg:"student already exist with this email"
    });

  }

  const user=await adminModel.findOneAndUpdate(
    {
      _id:id,
      role:"student"
    },
    {
      email,
      name,
      courseIds,
      subjectIds
    },
    {
      new:true
    }
  );

  console.log(user);

  if(user==null){

    return res.send({
      msg:"student does not exist"
    });

  }

  return res.send({
    msg:"student update succesfuly",
    user
  });
}
async function getAllStudent(req,res){
  const allStudent=await adminModel.find({
    role:"student"
  }) .select("-password")
  .populate("courseIds")
  .populate("subjectIds").sort({_id:-1})
  if(allStudent.length==0){
return res.send({
    msg:"no student exist",
    allTeachers
})
}  
res.send({
    msg:"teacher fetched sucesfuly",
    students:allStudent
  })
}





module.exports={createStudent,deleteStudent,updateStudent,getAllStudent}