const express=require("express")
const router=express.Router()
const teacherController=require("../controllers/login.controller")
const teacherAuth=require("../middlewares/teacher.auth")

router.post("/login",teacherController.loginTeacher)
router.get("/profile",teacherAuth,teacherController.getProfile)
router.get("/courses",teacherAuth,teacherController.myCourses)
router.get("/students",teacherAuth,teacherController.myStudents)
router.get("/dashboard",teacherAuth,teacherController.dashboard)
router.post("/logout", teacherAuth, teacherController.logout);

module.exports=router