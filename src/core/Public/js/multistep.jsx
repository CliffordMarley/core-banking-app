const nxtBtn = document.querySelector("#submitBtn");
const form1 = document.querySelector("#form1");
const form2 = document.querySelector("#form2");
const form3 = document.querySelector("#form3");
const form4 = document.querySelector("#form4");
const form5 = document.querySelector("#form5");
const form6 = document.querySelector("#form6");

const icon1 = document.querySelector("#icon1");
const icon2 = document.querySelector("#icon2");
const icon3 = document.querySelector("#icon3");
const icon4 = document.querySelector("#icon4");
const icon5 = document.querySelector("#icon5");
const icon6 = document.querySelector("#icon6");

let familyMembers = []

var viewId = 1;
function nextForm() {
    const data = {
        basic:getFormData('basic_details_form'),
        contacts:getFormData('contacts_form'),
        next_of_kin:familyMembers,
        occupation:getFormData('occupation_form'),
		documents:SelectedDocuments,
		services:getFormData('products_and_services_form'),
    }

	console.log(data)
    if(viewId == 1 && (!Isset(data.basic.firstname) || !Isset(data.basic.lastname) || !Isset(data.basic.gender) || !Isset(data.basic.dob) ||  !Isset(data.basic.marital_status) || !Isset(data.basic.nationality))){
        toast("Some required fields in the Customer Basic Details section are missing!", "error")
        return
    }

    if(viewId == 2 && data.contacts.residency == 'PERMANENT'){
        if((!Isset(data.contacts.address_line_1) && !Isset(data.contacts.address_line_2)) || !Isset(data.contacts.city) || !Isset(data.contacts.email_address) || !Isset(data.contacts.phone_number)){
            toast("Some required fields in the Contact Information section are missing!", "error")
            return
        }
    }

	if(viewId == 3 && data.next_of_kin <= 0){
		toast("Please make sure you add next of kin information to proceed!", "error")
		return
	}

	if(viewId == 4 && data.basic.employment_status == "EMPLOYED"){
        if(!Isset(data.occupation.employer_name) || !Isset(data.occupation.employer_address) || !Isset(data.occupation.employer_phone) || !Isset(data.occupation.job_title) || !Isset(data.occupation.net_monthly_income)){
            toast("Some required fields for Occupation section are missing!", "error")
            return
        }
    }

	if(viewId == 4 && !Isset(data.occupation.net_monthly_income)){
		toast("Please indicate customer Net Monthly Income!", "error")
		return
	}
	if(viewId == 5 && data.documents.length <= 0){
		toast("Please upload CDD and KYC documents for this file!", "error")
		return
	} 


	viewId = viewId + 1;
	console.log(viewId);
	if(viewId <= 6){
		progressBar();
		displayForms();
	}else{
		CreateCustomer(data)
	}
	
}

function prevForm() {
	console.log("helloprev");
	viewId = viewId - 1;
	console.log(viewId);
	progressBar1();
	displayForms();
}
function progressBar1() {
   
	if (viewId === 1) {
        
		icon2.classList.add("active");
		icon2.classList.remove("active");
		icon3.classList.remove("active");
		icon4.classList.remove("active");
		icon5.classList.remove("active");
        icon6.classList.remove("active");
	}
	if (viewId === 2) {
		icon2.classList.add("active");
		icon3.classList.remove("active");
		icon4.classList.remove("active");
		icon5.classList.remove("active");
        icon6.classList.remove("active");
	}
	if (viewId === 3) {
		icon3.classList.add("active");
		icon4.classList.remove("active");
		icon5.classList.remove("active");
        icon6.classList.remove("active");
	}
	if (viewId === 4) {
		icon4.classList.add("active");
		icon5.classList.remove("active");
        icon6.classList.remove("active");
	}
	if (viewId === 5) {
		icon5.classList.add("active");
        icon6.classList.remove("active");
	}
	if (viewId === 6) {
		icon5.classList.add("active");
	}
	if (viewId > 6) {
		icon2.classList.remove("active");
		icon3.classList.remove("active");
		icon4.classList.remove("active");
		icon5.classList.remove("active");
		icon6.classList.remove("active");
	}
}

function progressBar() {
	if (viewId === 2) {
		icon2.classList.add("active");
	}
	if (viewId === 3) {
		icon3.classList.add("active");
	}
	if (viewId === 4) {
		icon4.classList.add("active");
	}
	if (viewId === 5) {
		icon5.classList.add("active");
	}
	if (viewId === 6) {
		icon6.classList.add("active");
	}
	if (viewId > 6) {
		icon2.classList.remove("active");
		icon3.classList.remove("active");
		icon4.classList.remove("active");
		icon5.classList.remove("active");
		icon6.classList.remove("active");
	}
}

function displayForms() {
	if (viewId > 6) {
		viewId = 1;
	}

	if (viewId === 1) {
		form1.style.display = "block";
		form2.style.display = "none";
		form3.style.display = "none";
		form4.style.display = "none";
		form5.style.display = "none";
		form6.style.display = "none";
	} else if (viewId === 2) {
		form1.style.display = "none";
		form2.style.display = "block";
		form3.style.display = "none";
		form4.style.display = "none";
		form5.style.display = "none";
		form6.style.display = "none";
	} else if (viewId === 3) {
		form1.style.display = "none";
		form2.style.display = "none";
		form3.style.display = "block";
		form4.style.display = "none";
		form5.style.display = "none";
		form6.style.display = "none";
	} else if (viewId === 4) {
		form1.style.display = "none";
		form2.style.display = "none";
		form3.style.display = "none";
		form4.style.display = "block";
		form5.style.display = "none";
		form6.style.display = "none";
	} else if (viewId === 5) {
		form1.style.display = "none";
		form2.style.display = "none";
		form3.style.display = "none";
		form4.style.display = "none";
		form5.style.display = "block";
		form6.style.display = "none";
	} else if (viewId === 6) {
		form1.style.display = "none";
		form2.style.display = "none";
		form3.style.display = "none";
		form4.style.display = "none";
		form5.style.display = "none";
		form6.style.display = "block";
	}
}

// for slider

var slider = document.querySelector(".slider");
var output = document.querySelector(".output__value");

try {
	output.innerHTML = slider.value;
} catch (error) {
	console.log(error.message)
}


	try {
		slider.oninput = function () {
			output.innerHTML = this.value;
		};
	} catch (error) {
		console.log(error.message)
	}

