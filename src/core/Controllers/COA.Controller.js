const ChartOfAccountsModel = require('../Models/COA.Model')

module.exports = class{
    constructor(){
        this.coa = new ChartOfAccountsModel()
    }

    RenderIndexPage = async (req, res)=>{
        let coa
        try{
            coa = await this.coa.ReadAll()
        }catch(err){

        }finally{
            res.render('workspace',{
                title:'MX-Core | COA',
                partial:'chart-of-accounts',
                session:true,
                userdata:req.session.userdata,
                coa
            })
        }
    }

  
    Create = async (req, res)=>{
        const data = req.body
        try{
            let message = await this.coa.Create(data)
            console.log(message)
        }catch(err){
            console.log(err)
        }finally{
            res.redirect('/chart-of-accounts')
        }
    }
}