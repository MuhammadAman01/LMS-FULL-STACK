const express = require("express")
const adminAuth=require("../middlewares/auth.admin")
const  teacherController =require("../controllers/teacher.controller")
const router = express.Router()
router.post("/teacher",adminAuth,teacherController.createTeacher)
router.delete("/teacher/:id",adminAuth,teacherController.deleteTeacher)
router.patch("/teacher/:id",adminAuth,teacherController.updateTeacher)
router.get("/teachers",adminAuth,teacherController.getAllTeacher)
module.exports=router