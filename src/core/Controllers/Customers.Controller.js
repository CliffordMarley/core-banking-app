const {Isset} = require('../Helpers/Validation.Helper')
const ChartOfAccountsModel = require('../Models/COA.Model')
const RelationsModel = require('../Models/Relationship.Model')
const CountryModel = require('../Models/Country.Model')
const CityModel = require("../Models/City.Model")
const IDModel = require('../Models/ID.Model')
const MemberController = require('../Controllers/Members.Controller')
const MemberModel = require('../Models/Member.Model')
const CurrencyModel = require("../Models/Currency.Model")
const BranchModel = require("../Models/Branch.Model");
module.exports = class{
    constructor(){
        this.coa = new ChartOfAccountsModel()
        this.membercontroller = new MemberController()
        this.membermodel = new MemberModel()
        this.currencymodel = new CurrencyModel()
    }

    RenderLookupPage = (req, res)=>{
        res.render('workspace', {
            title:"MX-Core | Accounts",
            partial:"customer-lookup",
            session:true,
            userdata:req.session.userdata
            
        })
    }

    RenderKYCPage = async (req, res)=>{
        let id_types
        let member_id = req.query.member_id
        console.log(member_id)
        try{
            id_types = await new IDModel().ReadAll()
        }catch(err){

        }finally{
            res.render('workspace', {
                title:"MX-Core | KYC & CDD",
                partial:"kyc_cdd",
                session:true,
                userdata:req.session.userdata,
                id_types,
                member_id
            })
        }
    }

    RenderCreatePage = async (req, res)=>{
        let coa,relationships,countries,cities,doc_types
        try{
            coa = await this.coa.ReadAll()
            relationships = await new RelationsModel().ReadAll()
            countries = await new CountryModel().ReadAll()
            cities = await new CityModel().ReadAll()
            doc_types = await new IDModel().ReadAll()
        }catch(err){
            console.log(err)
            coa = []
        }finally{
            res.render('workspace', {
                title:"MX-Core | Accounts",
                partial:"customer-create",
                session:true,
                userdata:req.session.userdata,
                coa,
                relationships,
                countries,
                cities,doc_types
            })
        }
        
    }

    RenderIndividualCustomerView = async (req, res)=>{
        let message
        let customer, countries,coa,currencies,branches
        try{
            customer = await this.membercontroller.GetFullMemberProfile(req.query.member_id)
            branches = await new BranchModel().ReadAll()
            console.log(branches)
            countries = await new CountryModel().ReadAll()
            currencies = await this.currencymodel.ReadAll()
            coa = await this.coa.ReadAll()

            coa = coa.filter(item=>item.class_group = 'EXTERNAL')

            for(let i = 0; i < countries.length; i++){
                if(countries[i].id == customer.nationality_id){
                    countries[i].selected = true
                    break;
                }
            }
        }catch(err){
            console.log(err)
            message = {
                type:'error',
                intro:"Unexpected Error!",
                message:err.message
            }
        }finally{
            res.render('workspace', {
                title:"MX-Core | ("+req.query.member_id+")",
                partial:"individual-customer-view",
                session:true,
                userdata:req.session.userdata,
                customer,
                countries,
                message,
                coa, currencies,branches
            })
        }
    }

    Search = async (req, res)=>{
        try{
            let data = req.query

            //First Check Customer Type to determine which controller to use
            if (Isset(data.customer_type)) {
                switch (data.customer_type) {
                    case 'INDIVIDUAL':
                        const LocalFilter = {
                            customer_name:data.customer_name,
                            member_id:data.customer_ref,
                            created_at:data.date_created
                        }
                        data = await this.membermodel.Read(LocalFilter)
                        break;
                    case 'JOINT':
                        
                        break;
                    case 'CORPORATE':
                        
                        break;
                    default:
                        break;
                }
                res.json({
                    status:'success',
                    message:`${data.length} results found!`,
                    data
                })
            }else{
                res.status(401).json({
                    status:"error",
                    message:"Missing customer_type field (INDIVIDUAL, JOINT OR CORPORATE)"
                })
            }
        }catch(err){
            res.json({status:'error', message:err.message})
        }
    }
}