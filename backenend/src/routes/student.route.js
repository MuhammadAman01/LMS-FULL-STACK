const express=require("express")
const adminAuth=require("../middlewares/auth.admin")

const studentController=require("../controllers/student.controller")
const router = express.Router()

router.post("/student",adminAuth,studentController.createStudent)
router.delete("/student/:id",adminAuth,studentController.deleteStudent)
router.patch("/student/:id",adminAuth,studentController.updateStudent)
router.get("/students",adminAuth,studentController.getAllStudent)
module.exports=router