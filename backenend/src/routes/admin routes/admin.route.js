const express=require("express")
const {registerAdmin,loginAdmin,adminDashboard}=require("../../controllers/admin")
const router=express.Router()
router.post("/register",registerAdmin)
router.post("/login",loginAdmin)
router.get("/dashboard",adminDashboard)
module.exports=router
 