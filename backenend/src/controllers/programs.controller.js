
const courseModel=require("../models/course.model")

async function createPrograms(req,res){
const {courseName,courseCode,department,duration,description,status}=req.body
    const isExist = await courseModel.findOne({
            $or: [
                { courseName: courseName },
                { courseCode: courseCode }
            ]
        });

        if (isExist) {
            return res.status(400).send({
                success: false,
                msg: "Course name or course code already exists."
            });
        }


const course=await courseModel.create({
    courseName,
    courseCode,
    department,
    duration,
    description,
    status
})
    res.send({
        success:true,
        msh:"programm created sucesfuly",
        course
    })
}

async function deleteCourse(req,res){
const id=req.params.id
const deleteCourse=await courseModel.findOneAndDelete({
_id:id,

}) 
if (deleteCourse==null){
    return res.send({
        msg:" course doest not exist"
    })
 }

    return res.send({
        msg:"course delete sucesfuly",
         course:deleteCourse
    })
}

async function updateCourse(req,res){
const {courseName,courseCode,department,duration,description,status}=req.body
  const isExist = await courseModel.findOne({
            $or: [
                { courseName: courseName },
                { courseCode: courseCode }
            ]
        });

        if (isExist) {
            return res.status(400).send({
                success: false,
                msg: "Course name or course code already exists."
            });
        }
 
const id=req.params.id
  const course=await courseModel.findOneAndUpdate({
    _id:id,
  },{courseName,courseCode,department,duration,description,status},{new:true})
//   console.log(course)
  if(course==null){
    return res.send({
        msh:"course does not exist",
        course
    })
  }


    return res.send({
        msg:"student update succesfuly",
        course
    })
} 
async function getAllCourses(req,res){
const allCourses=await courseModel.find().sort({_id:-1})
if (allCourses.length === 0) {
    return res.status(404).send({
        msg: "No courses available",
        allCourses
    });
}
return res.status(200).send({
        msg:"courses ftech succesfuly",
        allCourses
    })
}
module.exports={createPrograms,deleteCourse,updateCourse,getAllCourses}