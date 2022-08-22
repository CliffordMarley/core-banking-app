const BranchModel = require("../Models/Branch.Model");
const { Isset } = require("../Helpers/Validation.Helper");
const CountryModel = require('../Models/Country.Model')
const CityModel = require("../Models/City.Model")

module.exports = class {
	constructor() {
		this.branchmodel = new BranchModel();
	}

	RenderIndex = async (req, res) => {
		let branches;
		try {
			branches = await this.branchmodel.ReadAll();
		} catch (err) {
			req.flash("message", {
				type: "error",
				intro: "Error Encountered!",
				message: err.message,
			});
		} finally {
			res.render("workspace", {
				title: "MX-Core | Branch List",
				partial: "branch-list",
				session: true,
				userdata: req.session.userdata,
				message: req.flash("message"),
				branches,
			});
		}
	};

	RenderCreatePage = async (req, res) => {
		let countries, cities
		try {
			countries = await new CountryModel().ReadAll()
			cities = await new CityModel().ReadAll()
		} catch (err) {
			req.flash("message", {
				type: "error",
				intro: "Error Encountered!",
				message: err.message,
			});
		} finally {
			res.render("workspace", {
				title: "MX-Core | Create Branch",
				partial: "branch-create",
				session: true,
				userdata: req.session.userdata,
				message: req.flash("message"),
				countries,
				cities
			});
		}
	};

	RenderViewPage = async (req, res) => {
		let branch;
		try {
			let branch_code = Isset(req.query.code)
				? req.query.code
				: req.session.userdata.branch.branch_code;
			console.log(branch_code);
			branch = await this.branchmodel.ReadOne(branch_code);
		} catch (err) {
			console.log(err);
			req.flash("message", {
				type: "error",
				intro: "Error Encountered!",
				message: err.message,
			});
		} finally {
			res.render("workspace", {
				title: "MX-Core | View Branch",
				partial: "branch-view",
				session: true,
				userdata: req.session.userdata,
				message: req.flash("message"),
				branch,
			});
		}
	};

	Create =  async(req, res)=>{
		const data = req.body

		try{
			//Check if branch code already exists 
			try{
				await this.branchmodel.ReadOne(data.branch_code)
				res.json({status:'error', message:'Branch code is already assigned to another entity!'})
			}catch(err){
				let message = await this.branchmodel.Create(data)
				res.json({status:'success', message})
			}
		}catch(err){
			res.json({status:'error', message:err.message})
		}

	}
};
