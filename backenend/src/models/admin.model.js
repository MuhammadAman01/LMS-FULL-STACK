const mongoose=require("mongoose")
const adminSchema=mongoose.Schema({
     name:{
        type:String,
        required:true,
     },

     email:{
        type:String,
 required:true,
 unique:true
    },

  password:{
        type:String,
        required:true
},
 role: {
    type: String,
    enum: ["admin", "teacher", "student"],
    default: "student"
  },
courseIds: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: "Course"
}],
subjectIds: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: "Subject"
}]

})

const adminModel=mongoose.model("users",adminSchema)
module.exports=adminModel