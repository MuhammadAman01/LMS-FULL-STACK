
const mongoose=require("mongoose")
async function connectDb(){
    try{

await mongoose.connect(process.env.MONGO_URI)
console.log("database connect successfully")

    }catch(err){ 
        console.error("db connectio error:",err)
    }
}

module.exports=connectDb
