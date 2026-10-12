const express=require("express")
const cookieParser=require("cookie-parser")
const adminRoute=require("../src/routes/admin.route")
const teacherRoute=require("../src/routes/teacher.route")
const studentRoute=require("../src/routes/student.route")
const programRoute=require("../src/routes/program.route")
const subjRoute=require("../src/routes/teacher/subject.route")
const teacherRoutes=require("./routes/login.route")
const assRoutes=require("./routes/ass.route")
const attRoutes=require("./routes/att.route")
const subRoutes=require("./routes/sub.route")
const stRoutes=require("./routes/st.route")
const cors = require("cors");


// const stRoutes=require("./routes/sub.route")
const app=express()
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(cookieParser())
app.use(express.json())
app.use("/api/admin",adminRoute)
app.use("/api/admin",teacherRoute)
app.use("/api/admin",studentRoute)
app.use("/api/admin",programRoute)
app.use("/api/admin",subjRoute)
app.use("/api/teacher",teacherRoutes)
app.use("/api/teacher",assRoutes)
app.use("/api/teacher",attRoutes)
app.use("/api/student",subRoutes)
app.use("/api/student",stRoutes)
app.use("/api/student",stRoutes)
// app.use("/api/student",stRoutes)


module.exports=app
