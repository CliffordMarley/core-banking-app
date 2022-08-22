
"use strict"


$(document).ready(()=>{
  $("#proceedBtn").click(()=>{
      CreateCustomer()
  })

  if(Isset($("#member_id_field").val())){
    GetKYCIDs($("#member_id_field").val())
  }

  $("#member_id_field").change(()=>{
      GetKYCIDs($("#member_id_field").val())
  })
  
  $("#member_id_field").keyup(()=>{
    GetKYCIDs($("#member_id_field").val())
})


 

  $("#postIDBtn").click(()=>{
      AddKYCDoc()
  })
})

//create customer

let CreateCustomer = (data)=>{
    //load("Creating Customer Information File...")
    const message = "Are you sure the Customer Information provided herein are correct?"
   Confirm(message, res=>{
       if(res){
            const options = {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(data)
            }
            $("#form6").addClass('loading')
            fetch(`${BaseURL}/members`, options)
            .then(res=>res.json())
            .then(res=>{
            toast(res.message, res.status)
            
            if(res.status = "success"){
                swal('Complete!',res.message, res.status)
                setTimeout(() => {
                    location.href = "/individual-customer-view?member_id="+res.data.member_id
                }, 2000);
            }else{
                $("#form6").removeClass('loading')
            }
            }).catch(err=>{
                $("#form6").removeClass('loading')
                toast("Connection Error!: Failed to post data to the server!", "error")
            })
       }
   })
}

let AddKYCDoc = ()=>{
    let data = getFormData("kyc_form")
    data.file_blob = selected_document_blob
    console.log(data)

    if(!Isset(data.file_blob)){
        toast("Please select a file to upload!", "error")
        return
    }
    if(!Isset(data.member_id)){
        toast("Missing Member CIF ID!", "error")
        return
    }
    if(!Isset(data.id_type)){
        toast("Please select the type of Identification Document you wish to add!", "error")
        return
    }
    if(!Isset(data.id_number)){
        toast("Missing ID number for uploaded document!", "error")
         return
    }
    if(!Isset(data.issue_date)){
        toast("Indicate date on which this document was issued!", "error")
         return
    }
    if(!Isset(data.expiry_date)){
        toast("Indicate date on which this document is set to expire!", "error")
         return
    }

    load('Posting Document...')
    const options = {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
    }

    fetch(`${BaseURL}/members/kyc`, options)
    .then(res=>res.json())
    .then(res=>{
        stopLoad()
       toast(res.message, res.status)
       if(res.status == "success"){
           
            //$("#kyc_form").trigger("reset")
            GetKYCIDs(data.member_id)
       }
    }).catch(err=>{
        stopLoad()
        toast("Connection Error!: Failed to post KYC data to the server!", "error")
    })


  
}

let GetKYCIDs = (member_id)=>{
    fetch(`${BaseURL}/members/kyc/${member_id}`, {method:"GET"})
    .then(res=>res.json())
    .then(res=>{
        if(res.status == "success"){
            kyc_table.destroy()
            let DOM = res.data.map((item,index)=>{
                return ` <tr>
                            <td>${(index+1)}</td>
                            <td>${item.document_type}</td>
                            <td>${item.id_number}</td>
                            <td>${item.issue_date}</td>
                            <td>${item.expiry_date}</td>
                            <td><a onclick="ShowImage('${BaseURL}/uploads/${item.url}')" href="#">Click to open file</></td>
                            <td style="width:50px !important;">
                                <button class="ui d-inline circular button icon mini yellow"><i class="icon edit"></i></button>
                            </td>
                            
                        </td>
                        </tr>`
            })

            DOM = DOM.join(',')
            $("#kyc_docs_table tbody").html(DOM)
            kyc_table =  $("#kyc_docs_table").DataTable({
                pageLength:5
            })
        }
    }).catch(err=>{
        stopLoad()
        toast("Connection Error!: Failed to fetch KYC data!", "error")
    })
}

function ShowImage(URL){
    // alert(URL)
    // var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
    // var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
    
    // var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    // var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
    
    // var left = ((width / 2) - (w / 2)) + dualScreenLeft;
    // var top = ((height / 2) - (h / 2)) + dualScreenTop;
    
    // window.open(URL, "", 'width=200,height=350, top=' + top + ', left=' + left);

    window.open(URL, "KYC/CDD Documentation", 'width=400,height=750');

}
const CustomerSearch = (params, callback)=>{
    if(!Isset(params.customer_name) && !Isset(params.customer_ref) && !Isset(params.date_created) && !Isset(params.corporate_reg_number)){
        toast('All search fields cannot be empty!', 'error')
        return
    }
    load("Fetching Member Profile...")
    const options = {
        method:"GET",
        headers:{
            'Content-Type':"application/x-www-form-urlencoded"
        }
    }

    params = Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');

    fetch(`${BaseURL}/customers?${params}`,options)
    .then(res=>res.json())
    .then(res=>{
        stopLoad()
        if(res.data.length > 0){
            toast(res.message, res.status)
        }else{
            toast("Query combination did not match any records!", 'warning')
        }
        if(res.status == "success"){
            callback(res.data)
        }else{
            callback('error')
        }
        }).catch(err=>{
            console.log(err)
            stopLoad()
            toast("Connection Error!: Failed to search for customers", "error")
        })
}



const GetMemberProfile = (member_id, callback)=>{
    load("Fetching Member Profile...")
    fetch(`${BaseURL}/members/${member_id}`, {method:"GET"})
    .then(res=>res.json())
    .then(res=>{
        stopLoad()
        if(res.status == "success"){
            callback(res.payload)
        }else{
            toast(res.message, res.status)
        }
        }).catch(err=>{
            console.log(err)
            stopLoad()
            toast("Connection Error!: Failed to fetch member profile!", "error")
        })
}

const ComposeMemberProfile = (member_id)=>{
    $("#member_id").html(member_id)
    GetMemberProfile(member_id, (data)=>{
        let KYCDocsDOM = data.kyc.map(kyc=>{
            return    ` <tr>
                            <td>${kyc.document_type}</td>
                            <td>${kyc.id_number}</td>
                            <td><a target="new" href="${BaseURL}/uploads/${kyc.url}">Click To View</a></td>
                        </tr>`
        })
        KYCDocsDOM = KYCDocsDOM.join(',')
        const DOM = ` <div class="row">
        <div class="col-7" >
            <fieldset class="card border border-secondary py-3">
                <legend style="color:rgb(185, 16, 16);font-weight:bold;font-size:14px;">Details</legend>
                <div class="row">
                    <div class="col-12" >
                        <table class="table table-sm table-striped table-hover">
                            <tr>
                                <td>Title :</td>
                                <td>${data.title}.</td>
                            </tr>
                            <tr>
                                <td>Customer Full Name :</td>
                                <td>${data.lastname} ${data.firstname} ${data.othernames}</td>
                            </tr>
                              <tr>
                                <td>Gender :</td>
                                <td>${data.gender}</td>
                            </tr>
                              <tr>
                                <td>Date Of Birth:</td>
                                <td>${data.dob}</td>
                            </tr>
                              
                              <tr>
                                <td>Marital Status :</td>
                                <td>${data.marital_status}</td>
                            </tr>
                              <tr>
                                <td>Nationality :</td>
                                <td>${data.nationality}</td>
                            </tr>
                              <tr>
                                <td>Created At :</td>
                                <td>${data.created_at}</td>
                            </tr>
                             
                              <tr>
                                <td>Residency :</td>
                                <td>${data.residency}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </fieldset>
            <fieldset class="card border border-secondary mt-2 py-3">
                <legend style="color:rgb(185, 16, 16);font-weight:bold;font-size:14px;">Contacts</legend>
                <div class="row">
                    <div class="col-12">
                        <table class="table table-sm table-striped table-hover">
                            
                              <tr>
                                <td>Phone Number :</td>
                                <td>${data.contacts.filter(item=>item.contact_type == "PHONE_NUMBER")[0].contact}</td>
                            </tr>
                              <tr>
                                <td>Physical Address :</td>
                                <td>${data.contacts.filter(item=>item.contact_type == "PHYSICAL_ADDRESS")[0].contact}</td>
                            </tr>
                              <tr>
                                <td>Email Address :</td>
                                <td><a href="mailto:${data.contacts.filter(item=>item.contact_type == "EMAIL_ADDRESS")[0].contact}">${data.contacts.filter(item=>item.contact_type == "EMAIL_ADDRESS")[0].contact}</a></td>
                            </tr>
                        </table>
                    </div>
                </div>
            </fieldset>
            <fieldset class="card border border-secondary mt-2 py-3">
                <legend style="color:rgb(185, 16, 16);font-weight:bold;font-size:14px;">Next Of Kin</legend>
                <div class="row">
                    <div class="col-12">
                        <table class="table table-sm table-striped table-hover">
                            
                              <tr>
                                <td>Name :</td>
                                <td>${data.next_of_kin[0].nok_fullname}</td>
                            </tr>
                              <tr>
                                <td>Relationship :</td>
                                <td>${data.next_of_kin[0].nok_relationship}</td>
                            </tr>
                              <tr>
                                <td>Phone Number</td>
                                <td>${data.next_of_kin[0].nok_phone}</td>
                            </tr>
                            <tr>
                                <td>Physical Address :</td>
                                <td>${data.next_of_kin[0].nok_physical_address}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </fieldset>
        </div>
        <div class="col-5">
              <fieldset class="card border border-secondary py-3">
                <legend style="color:rgb(185, 16, 16);font-weight:bold;font-size:14px;">ID Image</legend>
                <div class="row">
                    <div class="col-12">
                          <div style="height: 25vh;" id="kycPreviewCanvas" class="ui image kyc_display_image"></div>
                    </div>
                </div>
            </fieldset>
            <fieldset class="card border border-secondary mt-2 py-3">
                <legend style="color:rgb(185, 16, 16);font-weight:bold;font-size:14px;">Occupation</legend>
                <div class="row">
                    <div class="col-12">
                        <table class="table table-sm table-striped table-hover">
                            
                              <tr>
                                <td>Employer :</td>
                                <td>${data.employer_name}</td>
                            </tr>
                              <tr>
                                <td>Phone :</td>
                                <td>${data.employer_phone}</td>
                            </tr>
                            <tr>
                                <td>Phy Address :</td>
                                <td>${data.employer_address}L</td>
                            </tr>
                            <tr>
                                <td>Designation:</td>
                                <td>${data.designation}</a></td>
                            </tr>
                            <tr>
                                <td>Net Monthly Income:</td>
                                <td>${accounting.formatMoney(parseFloat(data.net_monthly_income),{ symbol: 'MK', format: "%s %v"})}</a></td>
                            </tr>
                        </table>
                    </div>
                </div>
            </fieldset>
            <fieldset class="card border border-secondary mt-2 py-3">
                <legend style="color:rgb(185, 16, 16);font-weight:bold;font-size:14px;">KYC & CDD Documents</legend>
                <div class="row">
                    <div class="col-12">
                        <table class="table table-sm table-striped table-hover">
                              ${KYCDocsDOM}
                        </table>
                    </div>
                </div>
            </fieldset>
        </div>
    </div>`

    $("#user_profile_section").html(DOM)
    })
}

function PostCustomerInformationChanges(data){
    return new Promise(async (resolve, reject) => {
        Confirm('Are you sure you want to request changes to the CIF?', async (res)=>{
       if(res){
           const options = {
               method:"PUT",
               headers:{
                   'Content-Type':'application/json',
               },
               body:JSON.stringify(data)
           }
           try{
               let response = await fetch(`${BaseURL}/members`, options)
               response = await response.json()
               toast(response.message, response.status)
               if(response.status == 'success'){
                   resolve('success')
               }else{
                   reject(response.message)
               }
           }catch(err){
               toast(err.message, 'error')
           }
       }
   })
    })
   
}