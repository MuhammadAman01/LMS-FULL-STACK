const {ImageKit}=require("@imagekit/nodejs")

const  ImageKitClient=new ImageKit({
    privateKey:process.env.IMAGEKIT_PRIVATE_KEY,
})
async function uploadFileByteacher(file) {
    const result=await  ImageKitClient.files.upload({
        file,
        fileName: "assignment_" +Date.now(),
        folder:"/All_teacher_Assignment_"
    })
      return result
}
  
async function uploadFile(file) {
    const result=await  ImageKitClient.files.upload({
        file,
        fileName: "assignment_" +Date.now(),
        folder:"/All_student_Assignment"
    })

    return result
}

module.exports={uploadFile,uploadFileByteacher}