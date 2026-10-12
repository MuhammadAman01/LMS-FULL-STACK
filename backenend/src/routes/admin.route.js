const express=require("express")
const {registerAdmin,loginAdmin,adminDashboard,getProfile,adminLogout}=require("../controllers/admin.controller")
const adminAuth=require("../middlewares/auth.admin")
const router=express.Router()
router.post("/register",registerAdmin)
router.post("/login",loginAdmin)
router.get("/dashboard",adminDashboard)
router.get("/profile", adminAuth, getProfile);
router.post("/logout", adminAuth,adminLogout );
module.exports=router
 