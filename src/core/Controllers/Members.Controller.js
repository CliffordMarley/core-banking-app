const { GenerateMemberID, IsCustomerDetailsValid } = require("../Helpers/Member.Helper")
const { Isset } = require("../Helpers/Validation.Helper")
const MemberModel = require("../Models/Member.Model")
const ContactModel = require("../Models/Contact.Model")
const ChangesModel = require('../Models/Changes.Model')
const NOKModel = require('../Models/NOK.Model')
const KYCModel = require("../Models/KYC.Model")

const FilesController = require('../Controllers/File.Controller')


module.exports = class{

    constructor(){
        this.membermodel = new MemberModel()
        this.contactsmodel = new ContactModel()
        this.changesmodel = new ChangesModel()
    }

    Create = async (req, res)=>{
        let data = req.body
        //console.log('data: %s', JSON.stringify(data))
        let status, message
        if(IsCustomerDetailsValid(data)){
           try{
               data.basic.branch = req.session.userdata.branch.branch_code
               
                const member_id = await GenerateMemberID(data.basic.branch)
                data.basic.member_id = member_id
                //data.basic.branch = req.session.userdata.branch.branch_code
                data.basic.residency = data.contacts.residency
                await this.membermodel.Create(data.basic, data.occupation)
                data.contacts.member_id = member_id

                //Add available contacts to Member CIF
                this.AddContacts(data.contacts)
                //Add next of kin to Member CIF
                this.AddNextOfKin(data.next_of_kin, member_id)

                //Upload KYC & CDD Documents
                
                data.documents.forEach(async document=>{
                    document.member_id = member_id
                    let response = await this.ProcessMemberDocument(document)
                    console.log(response)
                })

                status = 'success'
                message = "New CIF registration was successfull!"
                res.json({status, message, data:{member_id}})
           }catch(err){
               console.log(err)
                status = 'error'
                message = err.message
                res.json({status, message})
           }
        }else{
            res.json({
                status:"error",
                message:"Missing required field detected!"
            })
        }

    }

    //Insert Next Of Kin
    AddNextOfKin = (data, member_id)=>{
       data.forEach(async familyMember => {
        familyMember.member_id = member_id
        let response = await new NOKModel().Create(familyMember)
        console.log(response)
       });
    } 

    //Insert Contacts
    AddContacts = async (data)=>{
        if(Isset(data.phone_number)){
            const contactObj = {"member_id":data.member_id, 'contact_type':"PHONE_NUMBER", 'contact':data.phone_number}
            await this.contactsmodel.Create(contactObj)
            console.log("Phone Number added to contacts!")
        }
        if(Isset(data.email_address)){
            const contactObj = {"member_id":data.member_id, 'contact_type':"EMAIL_ADDRESS", 'contact':data.email_address}
            await this.contactsmodel.Create(contactObj)
            console.log("Email address added to contacts!")

        }
        if(Isset(data.residency == "PERMANENT")){
            const address = `${data.address_line_1},${data.address_line_2}, ${data.city}`
            const contactObj = {"member_id":data.member_id, 'contact_type':"PHYSICAL_ADDRESS", 'contact':address}
            await this.contactsmodel.Create(contactObj)
            console.log("Physical address added to contacts!")
        }
    }

    Get = async (req, res)=>{
        let status, message, payload
        return new Promise(async (resolve, reject)=>{
            try{
                payload = await this.membermodel.Read(req.query)
                status = 'success'
                message = payload.length > 0 ? payload.length+" Results found!" : "No results found!"
                
            }catch(err){
                console.log(err)
                status = "error"
                message = err.message
            }finally{
                res.json({status, message, payload})
            }
        })
    }

    
    GetOne = async (req, res)=>{
            let status, message, payload
            try{
                const member_id = req.params.member_id
                payload = await this.GetFullMemberProfile(member_id)
                status = 'success'
                message = "Member found!"
            }catch(err){
                console.log(err)
                status = "error"
                message = err.message
            }finally{
                res.json({status, message, payload})
            }
    }

    GetFullMemberProfile = async (member_id)=>{
        return new Promise(async (resolve, reject)=>{
            try{
                let payload = await this.membermodel.ReadOne(member_id)
                payload.contacts = await this.contactsmodel.Read({member_id})
                payload.next_of_kin = await new NOKModel().Read(member_id)
                payload.kyc = await new KYCModel().Read(member_id)
                resolve(payload)
            }catch(err){
                console.log(err)
                reject(err)
            }
        })
    }

    ProposeUpdate = async (req, res)=>{
        const payload = req.body
        console.log(payload)
        const data = {
            payload:JSON.stringify(payload),
            created_by:req.session.userdata.email_address,
            target:"tbl_members",
            action:"UPDATE"
        }
        try{
            let existing = await this.changesmodel.Read(data.target)
            let check = false
            for (let i = 0; i < existing.length; i++) {
                const ParsedData = JSON.parse(existing[i].serialized_values)
               if(ParsedData.member_id == payload.member_id){
                    check = true
                    break;
               }
            }
            if(check){
                res.json({status:"error",message:"There are Un-Approved changes for this customer already. Request approval first!"})
            }else{
                const message = await this.changesmodel.Create(data)
                res.json({status:"success",message})
            }
            
        }catch(err){
            res.status(500).json({
                status:"message",
                message:"Internal Server Error!",
                errorDesc:err
            })
        }
    }

    ApproveUpdate = async (req, res)=>{
        const change_id = req.params.change_id
        try{
            //Check if provided change ID is valid!
            let data = await this.changesmodel.ReadOne(change_id)
            if(data.status == 'AWAITING.APPROVAL'){
                let message = await this.membermodel.Update(JSON.parse(data.serialized_values))
                const body = {
                    checked_by:"esther@gmail.com",
                    change_id,
                    status:"COMMITTED"
                }
                await this.changesmodel.UpdateStatus(body)
                res.json({status:"success", message})
            }else{
                res.json({status:"error",message:`The provided change_id is already ${data.status}`})
            }

        }catch(err){
            res.json({status:"error", message:err.message})
        }
    }

    RejectUpdate = async (req, res)=>{
        const change_id = req.params.change_id
        try{
            //Check if provided change ID is valid!
            let data = await this.changesmodel.ReadOne(change_id)
            if(data.status == 'AWAITING.APPROVAL'){
                const body = {
                    checked_by:req.session.userdata.email_address,
                    change_id,
                    status:"REJECTED"
                }
                await this.changesmodel.UpdateStatus(body)
                res.json({status:"success", message:"Member changes have been Rejected Successfully!"})
            }else{
                res.json({status:"error",message:`The provided change_id is already ${data.status}`})
            }

        }catch(err){
            res.json({status:"error", message:err.message})
        }
    }

    UploadKYC = async (req, res)=>{
        const data = req.body
        try{
            let message = await this.ProcessMemberDocument(data)
            res.json({status:'success', message})
       }catch(err){
           res.json({status:"error", message:err.message})
       }
       
    }

    ProcessMemberDocument = async (data)=>{
        data.file_name = await new FilesController().ConvertBase64ToFile(data.Base64Text)
        const message = await new KYCModel().Create(data)
        return message
    }

    GetKYC = async (req, res)=>{
        try{
            let data = await new KYCModel().Read(req.params.member_id)
            res.json({status:"success", message:`${data.length} results found!`, data})
        }catch(err){
            res.json({status:"err", message:err.message})
        }
    }
}