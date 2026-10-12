const express=require("express")
const programsController=require("../controllers/programs.controller")
const adminAuth=require("../middlewares/auth.admin")

const router=express.Router()

router.post("/program",adminAuth,programsController.createPrograms)
router.delete("/program/:id",adminAuth,programsController.deleteCourse)
router.patch("/program/:id",adminAuth,programsController.updateCourse)
router.get("/programs",adminAuth,programsController.getAllCourses)
module.exports=router