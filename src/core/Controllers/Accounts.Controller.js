

module.exports = class{
    
    constructor(){

    }

    RenderCreatePage = async (req, res)=>{
        let message = {}
        try{

            message = null
        }catch(err){
            message.type = 'danger'
            message.message = err.message
        }finally{
            res.render('workspace',{
                title:"MX-Core | Account Create",
                partial:'account-create',
                session:true,
                userdata:req.session.userdata,
                message
            })
        }
    }
}