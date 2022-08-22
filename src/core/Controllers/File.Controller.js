const base64Img = require('base64-img')
const { randomUUID } = require('crypto')
const path = require("path")
module.exports = class{

    ConvertBase64ToFile = (base64Text)=>{
        return new Promise((resolve, reject)=>{
            try{
                
                let fileExtension = base64Text.split('data:image/')
                fileExtension = fileExtension[1].split(';')
                fileExtension = fileExtension[0]
                const FileName = randomUUID()
                // const FileURL = path.join(__dirname,'../Public/uploads/'+FileName)
                const data = base64Img.imgSync(base64Text, 'Public/uploads', FileName)
                console.log(FileName)
                if(fileExtension == 'jpeg' || fileExtension == 'jpg'){
                    resolve(FileName+'.jpg')
                }else{
                    resolve(FileName+"."+fileExtension)
                }
            }catch(err){
                reject(err)
            }
        })
    }
}