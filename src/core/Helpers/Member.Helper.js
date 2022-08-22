const MemberModel = require('../Models/Member.Model')
const {RunQuery} = require('../Models/Common.Model')
const moment = require("moment");
const {Isset} = require('./Validation.Helper')

// GenerateMemberID = (branch)=>{
//     return new Promise(async (resolve, reject) =>{
//         const stamp = `${moment().year()}${ZeroPad(moment().month())}`
//         let _proposed = stamp+(Math.floor(Math.random() * (9999 - 1001) + 1001))
//         console.log(`Proposed: %s`, _proposed)
//         try{
//             await new MemberModel.ReadOne(_proposed)
//             _proposed = await this.GenerateMemberID()
//             resolve(_proposed)
//         }catch(err){
//             resolve(_proposed)
//         }  
//     })
// }

GenerateMemberID = (branch)=>{
    return new Promise(async (resolve, reject) => {
        try{
            let year = moment().year()
            let month = moment().month()+1
            console.log("Year: %s and Month : %s", year, month)
            const SQL = `SELECT COUNT(*) AS count FROM tbl_members WHERE YEAR(created_at) = ${year} AND MONTH(created_at) = ${month} `
            
            let Count = await RunQuery(SQL)
            Count = Count[0].count
            console.log(Count)
            
            let _proposed = `${branch}${ZeroPad(Count)}${Count+1}`
            console.log('Proposed Member ID: %s', _proposed)
      
            resolve(_proposed) 
        }catch(err){
            reject(err)
        }

    })
}

ZeroPad = (value)=>{
    value = value.toString()
    let zeros =  "0000"
    
    return zeros.substring(value.length)
}

IsCustomerDetailsValid = (data)=>{
    if((!Isset(data.basic.firstname) || !Isset(data.basic.lastname) || !Isset(data.basic.gender) || !Isset(data.basic.dob) ||  !Isset(data.basic.marital_status) || !Isset(data.basic.nationality))){
        return {errMessage:"Some required fields in the Customer Basic Details section are missing!", status:"error"}
    }

    if(data.contacts.residency == 'PERMANENT'){
        if((!Isset(data.contacts.address_line_1) && !Isset(data.contacts.address_line_2)) || !Isset(data.contacts.city) || !Isset(data.contacts.email_address) || !Isset(data.contacts.phone_number)){
            return {errMessage:"Some required fields in the Contact Information section are missing!", status:"error"}
        }
    }

	if(data.next_of_kin <= 0){
		return {errMessage:"Please make sure you add next of kin information to proceed!", status:"error"}
	}

	if(data.basic.employment_status == "EMPLOYED"){
        if(!Isset(data.occupation.employer_name) || !Isset(data.occupation.employer_address) || !Isset(data.occupation.employer_phone) || !Isset(data.occupation.job_title) || !Isset(data.occupation.net_monthly_income)){
            return {errMessage:"Some required fields for Occupation section are missing!", status:"error"}
        }
    }

	if(!Isset(data.occupation.net_monthly_income)){
		return {errMessage:"Please indicate customer Net Monthly Income!", status:"error"}
	}
	if(data.documents.length <= 0){
		return {errMessage:"Please upload CDD and KYC documents for this file!", status:"error"}
	}

    return {status:'success'}
}
module.exports = {GenerateMemberID, IsCustomerDetailsValid}