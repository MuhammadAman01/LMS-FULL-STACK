
const express=require("express")
const router=express.Router()
const attendence2Controller=require("../controllers/attendence2.controller")

router.post("/attendence",teacherAuth,attendence2Controller.getStudentsForAttendance
)
module.exports=router
