"use strict";

let XMLHttP, content, account_in_focus;

$(document).ready(()=>{
    $("#getKYCImageBtn").click(()=>{
        $('#kyc_image_actual').click();
    })

    $('#kyc_image_actual').change(()=>{
        readURL(document.getElementById('kyc_image_actual'),'id_image');
    });

    $("#updateKYCBtn").click(e=>{
        updateKYCDetails();
    })

    $("#search_form").submit((e)=>{
        e.preventDefault();
        searchAccount();
    });

    $("#registration_form").submit(e => {
        e.preventDefault();
        registerAccount();
    });


    getAccountTypes();
});

function liveSearch(msisdn){
   if(msisdn == ""){
        return false;
   }
   fetch(`${CORE_URL}/accounts/${msisdn}/${$("input[name='account_type']:checked").val()}`, {
       method:"GET",
       headers:{
           'Authorization':`Bearer ${TOKEN}`
       }
   }).then(response=>response.json())
   .then(response=>{
            
            if(response.status == 'success'){
                content = response.data;
                let DOM = ``;
                if(content.length > 0){
                    content.forEach(account => {
                        DOM += ` <a href="#" onclick="selectResult(${account.account_number}, '${account.account_type}')" class="list-group-item list-group-item-action border-1">${account.firstname} ${account.lastname} - (${account.account_number})</a>`
                    });
                }else{
                    DOM = `<a href="#" class="list-group-item list-group-item-action border-1"><h3 class="text-danger">No Results Found!</h3></a>`;
                }
                $('#show-list').html(DOM);
            }else{
                $.notify(response.message, response.status);
            }
   }).catch(err=>{
      $.notify('Connection Error!', 'error')
      let DOM = `<a href="#" class="list-group-item list-group-item-action border-1"><h3 class="text-danger">Error connecting to database</h3></a>`;
        $('#show-list').html(DOM);
   })
}

function selectResult(account_number, account_type){

    //phone_number = phone_number.toString();
    window.TXN_ACC = account_number
    let account = content.filter(account=>account.account_number == account_number)[0]
    account_in_focus = account
    $('#show-list').html('');
    //$("#search_account").val("0"+phone_number.substring(3, (phone_number.length )))
    //$("#preview_phone_number").html("0"+phone_number.substring(3, (phone_number.length )));
    $("#account_search_btn i").removeClass('loading');
            $("#acc_number").html(account.account_number);
            $("#acc_name").html(`${account.firstname} ${account.lastname}`.toUpperCase());
            $("#acc_type").html(account_type);
            $("#acc_status").html((account.account_status == 'ACTIVE' ? `<span style="font-weight:bold;" class="text-success" >${account.account_status }</span>` : `<span style="font-weight:bold;" class="text-danger" >${account.account_status }</span>`));
            $("#acc_create_date").html(account.date_created);
            $("#acc_balance").html(accounting.formatNumber(account.balance, 2, " "));
            $("#acc_id_type").html((account.id_type == 'NRB' ? 'NATIONAL ID (NRB' : account.id_type));
            $("#acc_id_number").html(account.id_number);
            $('#acc_id_issue_date').html(account.issue_date);
            $("#acc_id_expiry_date").html(account.expiry_date);
            $("#kyc_card_image").attr('src', `http://localhost:3000/mx-static-assets/uploads/id_cards/${account.card_image}`);

            
            $("#display_details_area").removeClass('d-none').transition('fade in');

            getKYCDetails(account_number)
}


function getAccountTypes(){
    fetch(`${CORE_URL}/accounts/types`,{
		headers:{
			Authorization: `Bearer ${TOKEN}`
		}
	})
    .then(res => res.json())
    .then(res => {
        try{
            let options = res.data.map(acc_type=>{
                return `<option value="${acc_type.id}">${acc_type.type}</option>`
            })
            options = options.join();
            options = `<option value="" selected>All Types</option>${options}`
            $('.form-control.account_type').html(options);
        }catch(e){
            console.log(e)
            console.log('No matching form field to match!');
        }
    })
    .catch(err=>{
        console.log('Failed to fetch account types!');
    })
}

function searchAccount(){
    const searchParam = getFormData('search_form');

    let query = Object.keys(searchParam)
             .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(searchParam[k]))
             .join('&');
    
    const options = {
        method:"GET",
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        }
    };

    load('Searching for accounts...');
    fetch(`${baseURL}/accounts/search/advanced?${query}`, options, 3000)
    .then(res => res.json())
    .then(res => {
        stopLoad();
        if(res.status == 'success'){
            content = res.data;
            const accounts = res.data;
            try{
                accounts_table.destroy();
            }catch(e){
                console.log('Failed to destroy Data Table!');
            }
            let account_list = accounts.map(account => {
                
                let phone_numbers = account.phone_list.map(obj=>{
                    return `${obj.phone_number}\n`;
                })
                
                return `<tr>
                            <td>${phone_numbers.join()}</td>
                            <td>${account.firstname.toUpperCase()} ${account.lastname.toUpperCase()}</td>
                            <td>${account.gender}</td>
                            <!--td>${account.dob}</td-->
                            <td>${account.type}</td>
                            <td>${accounting.formatMoney(account.balance, { symbol: "MK",  format: "%s%v" })}</td>
                            <td style"color:${(account.account_status == 'ACTIVE'? 'green' : 'red')} !important;">${account.account_status}</td>
                            <td class="text-center"><div>
                            <a href="#account-view" onclick = "viewAccount(${account.account_number})" class="btn btn-sm btn-outline-primary">View </a></div>
                            </td>
                        </tr>`;
            });
            account_list = account_list.join();
            $("#accounts_list tbody").html(account_list);
            try{
                
                accounts_table = $("#accounts_list").DataTable({
                    searching:true,
                    buttons: [
                        'copy', 'excel', 'pdf'
                    ]
                });
            }catch(e){
                console.error('Failed to reform Data Table.');
            }
        }else{
            swal('Search Failed!', res.message, res.status);
        }
    })
    .catch(err => {
        console.error(err)
        stopLoad();
        swal('Connection Error!', 'Something went wrong with the search request!', 'error');
    })
}

function registerAccount(){
    const data = getFormData('registration_form');
    data.dob = new Date(`${data.day}-${data.month}-${data.year}`);

    if(!data.account_type || data.account_type == null || data.account_type == "" || data.account_type == typeof undefined){
        swal('Attention!', "Missing required field of \"Account Type\"", 'warning');
        return;
    }

    if(!data.phone_number || data.phone_number == null || data.phone_number == "" || data.phone_number == typeof undefined){
        swal('Attention!', "Missing required field of \"First Name\"", 'warning');
        return;
    }

    if(!data.firstname || data.firstname == null || data.firstname == "" || data.firstname == typeof undefined){
        swal('Attention!', "Missing required field of \"First Name\"", 'warning');
        return;
    }

    if(!data.lastname || data.lastname == null || data.lastname == "" || data.lastname == typeof undefined){
        swal('Attention!', "Missing required field of \"Last Name\"", 'warning');
        return;
    }

    if(!data.gender || data.gender == null || data.gender == "" || data.gender == typeof undefined){
        swal('Attention!', "Missing required field of \"Gender\"", 'warning');
        return;
    }
 
    if(!data.month || data.month == "" || data.month == null || data.month == typeof undefined || !data.year || data.year == "" || data.year == null || data.year == typeof undefined || !data.day || data.day == "" || data.day == null || data.day == typeof undefined){
        swal('Attention!', "Please set account holder's birthday!", 'warning');
        return;
    }

    if(data.account_type == 2){
        if(!data.district || data.district == null || data.district == "" || data.district == typeof undefined){
            swal('Attention!', "Missing required field of \"District\"", 'warning');
            return;
        }
    }

    $("#newAccountDismiss").click();
    load('Creating new account...');

    const options = {
        method:"POST",
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(data)
    }


    fetch(`${baseURL}/accounts`, options)
    .then(res => res.json())
    .then(res => {
        stopLoad();
        swal('', res.message, res.status);
        if(res.status == 'success'){
            $("#registration_form").trigger('reset');
            $("#newAccountForm .form-row .form-group.form-containers").hide();
        }else{
            $("#newAccountModalBtn").click();
        }
    })
    .catch(err => {
        $("#newAccountModalBtn").click();
        stopLoad();
    })

    
}


function viewAccount(account_number){
    const query = 'account_number='+account_number;
    fetchTransactions(query);
    $("#account_search_page").hide();
    $("#account_view_page").show().transition('fade in');
    let account;
    for(let i = 0; i < content.length; i++){
        if(content[i].account_number == account_number){
            account = content[i]
            break;
        }
    }
    //Assigning account details to global variables;
    account_in_focus = account;

    //Setting variables to DOM for rendering
    $("#display_acc_number").html(account.account_number);
    $("#display_name").html(`${account.firstname} ${account.lastname}`);
    $("#display_gender").html(account.gender);
    $("#display_dob").html(account.dob);
    let phone_numbers = account.phone_list.map(phone=>{
        return phone.phone_number+'';
    })
    phone_numbers = phone_numbers.join();
    $("#display_phone").html(phone_numbers);
    $("#display_type").html(account.type);
    $("#display_status").html(account.account_status).css('color', (account.account_status == 'ACTIVE' ? 'green' : 'red'));
    $("#display_balance").html(accounting.formatMoney(account.balance, { symbol: "MK",  format: "%s%v" }));
    $("#display_risk_level").html(account.risk_level);
    $("#display_opening_date").html(account.opening_date);
    $("#display_image").attr('src', `http://localhost:3000/mx-static-assets/uploads/id_cards/${account.card_image}`)
    $("#acc_id_type").html(`${(account.id_type == 'NRB' ? 'NATIONAL ID (NRB)' : (account.id_type == 'PASSPORT' ? 'INTERNATIONAL PASSPORT' : 'NOT SET'))}`.toUpperCase());
    $("#acc_id_number").html((account.id_number != null ? account.id_number.toUpperCase() : 'NOT SET'));
    $("#acc_id_issue_date").html((account.issue_date != null ? account.issue_date : 'NOT SET'));
    $("#acc_id_expiry_date").html((account.expiry_date != null ? account.expiry_date : 'NOT SET'));

    //RENDER PHONE NUMBERS TO MODAL TABLE
    let table_data = account.phone_list.map((phone, index)=>{
        return `<tr>
                    <td>${index+1}</td>
                    <td>${phone.phone_number}</td>
                    <td>${phone.priority}</td>
                    <td>
                    <button type="button" onclick="removePhoneNumber('${phone.phone_number}')" class="btn btn-sm btn-block btn-outline-danger rounded">
                      Remove
                    </button>
                    </td>
                </tr>`;
    })

    const rows = table_data.join();
    $("#phone_list_table tbody").html(rows);


    if(account.type == 'AGENT'){
        $("#agent_detals").removeClass('d-none');
        $("#display_agent_code").html(account.agent_code);
        $("#display_district").html(account.district.toUpperCase());
    }   
}


function backToAccountsList(){
    $("#account_view_page").hide().transition('fade out');
    $("#account_search_page").show();
    $("#agent_detals").addClass('d-none');
}

function updateKYCDetails(){
    const details = getFormData('kyc_form');
    details.account_number = account_in_focus.account_number;
    console.log(details);

    if(!details.account_number || details.account_number == "" || details.account_number == null || details.account_number == typeof undefined){
        swal('System Crash!', 'Processing variables unset!', 'error');
        return;
    }

    if(!details.id_number || details.id_number == "" || details.id_number == null || details.id_number == typeof undefined){
        swal('Attention!', 'You are required to set the ID Number!', 'warning');
        return;
    }

    if(!details.issue_date || details.issue_date == "" || details.issue_date == null || details.issue_date == typeof undefined){
        swal('Attention!', 'Card Issue Date is required!', 'warning');
        return;
    }

    if(!details.expiry_date || details.expiry_date == "" || details.expiry_date == null || details.expiry_date == typeof undefined){
        swal('Attention!', 'Card Expiry date is required!', 'warning');
        return;
    }

    const fileTypes = ['jpeg','jpg','png','gif','svg'];
    uploadFile(
        'kyc_image_actual',
        '/accounts/kyc/image',
        fileTypes,
        20000000,
        response => {
            if(response != 'error'){

                details.filename = response;
                const options = {
                    method:"POST",
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify(details)
                }

                load('Processing KYC details...');
                fetch(`${baseURL}/accounts/kyc/details`, options)
                .then(res => res.json())
                .then(res => {
                    stopLoad();
                    if(res.status == 'success'){
                        $("#dismissKYCModalBtn").click();
                        $("#display_image").attr('src', `http://localhost:3000/mx-static-assets/uploads/id_cards/${details.filename}`)
                        $("#acc_id_type").html(`${(details.id_type == 'NRB' ? 'NATIONAL ID (NRB)' : details.id_type)}`.toUpperCase());
                        $("#acc_id_number").html(details.id_number.toUpperCase());
                        $("#acc_id_issue_date").html(details.issue_date);
                        $("#acc_id_expiry_date").html(details.expiry_date);
                    }
                    swal('', res.message, res.status);
                })
                .catch(err => {
                    stopLoad();
                    swal('Process Error!', 'Something went wrong while sending request...', 'error');
                })
            }
        }
    );
}

/*Phone number manaement functions
 will implement the phone number add, r capemove and view capabilities
*/

const PHONE = {
    process: (payload, method)=>{

        const options = {
            method,
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(payload)
        }

        $('#new_phone_modal_content').addClass('loading');
        
        fetch(`${baseURL}/accounts/msisdn`, options)
        .then(res => res.json())
        .then(res => {
            $('#new_phone_modal_content').removeClass('loading');
            if(res.status == 'success'){
                $("#new_phone_modal_content").trigger('reset');
                for(let i = 0; i < content.length; i++){
                    if(payload.account_number == content[i].account_number){
                        if(method == 'POST'){
                            content[i].phone_list.push({
                                'phone_number':payload.msisdn,
                                'priority':'SECONDARY'
                            });
                        }else{
                            for(let x = 0; x < content[i].phone_list.length; x++){
                                if(content[i].phone_list[x].phone_number == payload.msisdn){
                                    content[i].phone_list.pop(content[i].phone_list[x]);
                                }
                            }
                        }
                        break;
                    }
                }
                viewAccount(payload.account_number);
            }
            
            swal('', res.message, res.status);
        })
        .catch(err => {
            $('#new_phone_modal_content').removeClass('loading');
            swal('Process Error!', 'Something went wrong with the request!', 'error');
        })
    },


}

function removePhoneNumber(msisdn){
    const payload = {
        msisdn,
        account_number : account_in_focus.account_number
    };

    PHONE.process(payload, 'DELETE');
}




function managePhoneNumber(){
    $("#launch_phone_modal").click();
}