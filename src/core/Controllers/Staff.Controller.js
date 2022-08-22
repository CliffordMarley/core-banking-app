const StaffModel = require('../Models/Staff.Model')
const BranchModel = require("../Models/Branch.Model")
const MenuModel = require("../Models/Menu.Model")
module.exports = class{
    constructor(){
        this.staffmodel = new StaffModel()
        this.branchmodel = new BranchModel()
        this.menumodel = new MenuModel()
    }

    Authenticate = async (req, res)=>{
        return new Promise(async (resolve, reject)=>{
            const  data = req.body
            
            try{
                let userdata = await this.staffmodel.Authenticate(data)
                userdata.branch = await this.branchmodel.ReadOne(data.branch)
                userdata.menus = await this.menumodel.ReadAll()

                //Store user data in session
                req.session.userdata = userdata
                req.flash('message',{
                    type:"success",
                    intro:"Access Granted!",
                    message:"Access Granted: Your session has began. From this point on, every action will be recorded!"
                })
                //console.log(userdata)
                res.json({status:'success', message:"Credentials Authenticated Successfull!"})
                
            }catch(err){
                res.json({status:'error', message:err.message})
            }
        })
    }

    FetchBranch = async (req, res)=>{
        try{
            const branches = await this.branchmodel.ReadByStaff(req.params.staff_id)
            res.json({status:'success', message:"Branch fetched!", data:branches})
        }catch(err){
            res.json({status:'error', message:err.message})
        }
    }

    //Create user account 
    Create = async (req, res)=>{
        return new Promise(async (resolve, reject)=>{
            const  data = req.body
            try{
                await this.staffmodel.Create(data)
                res.json({status:'success', message:"User account created successfully!"})
            }catch(err){
                res.json({status:'error', message:err.message})
            }
        })
    }
}