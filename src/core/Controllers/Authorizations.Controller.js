const MemberModel = require("../Models/Member.Model")
const ChangesModel = require("../Models/Changes.Model")
module.exports = class{

    constructor(){
        this.membermodel = new MemberModel()
    }

    RenderCustomerAuth = async (req, res)=>{
        let unapproved_members ,feedBack
        
        try{
            unapproved_members = await this.membermodel.Read({
                status:"AWAITING.APPROVAL",
                branch:req.session.userdata.branch.branch_code
            })
           
        }catch(err){

        }finally{
            feedBack = req.flash('message')
           
            res.render('workspace',{
                title:"MX-Core | Authorizations",
                partial:'non-transactional-authorizations-customer',
                session:true,
                userdata:req.session.userdata,
                unapproved_members,
                message:feedBack.length > 0 ? feedBack[0] : ''
            })
        }
    }

    RenderChangesAuth = async (req, res)=>{
        let  uncommitted_changes ,feedBack
        
        try{
           
            uncommitted_changes = await new ChangesModel().Read('tbl_members')
            uncommitted_changes = uncommitted_changes.filter(change=>change.status == 'AWAITING.APPROVAL')
            for (let i = 0; i < uncommitted_changes.length; i++) {
                //console.log(uncommitted_changes[i].serialized_values)
                uncommitted_changes[i].payload = JSON.parse(uncommitted_changes[i].serialized_values)            
                console.log(uncommitted_changes[i].payload.member_id)    
            }
           
        }catch(err){

        }finally{
            feedBack = req.flash('message')
           
            res.render('workspace',{
                title:"MX-Core | Authorizations",
                partial:'non-transactional-authorizations-changes',
                session:true,
                userdata:req.session.userdata,
                uncommitted_changes,
                message:feedBack.length > 0 ? feedBack[0] : ''
            })
        }
    }

    MemberAuthDecision = async (req, res)=>{
        let {member_id, decision} = req.body
       try{
        if(Array.isArray(member_id)){
            for(let i = 0; i < member_id.length; i++){
                await this.membermodel.Update({
                    member_id:member_id[i],
                    status:decision
                })
            }
        }else{
            await this.membermodel.Update({
                member_id,
                status:decision
            })
        }

       if(decision == 'ACTIVE'){
        req.flash('message',{
            type:"success",
            intro:"Process Complete!",
            message:"Member(s) Authorized Successfully!"
        })
       }else{
        req.flash('message',{
            type:"success",
            intro:"Process Complete!",
            message:"New Member(s) Rejected Successfully!"
        })
       }
       }catch(err){
              console.log(err)
              req.flash('message',{
                type:"danger",
                intro:"Process Failed!",
                message:"An error occured while processing your request!"
              })
       }finally{
            res.redirect('/non-transactional-authorizations')
       }
       
    }
}