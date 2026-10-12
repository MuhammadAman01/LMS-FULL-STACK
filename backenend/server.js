require("dotenv").config();

const app=require("./src/app")
const connectDb=require("./src/db/db")
// const cors = require("cors");
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
connectDb()

app.listen(3000,()=>{
    console.log("server is running on port 3000")
})     


