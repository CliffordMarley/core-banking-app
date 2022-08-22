"use strict";

let subtotals;
notesValuesReset();
$(document).ready(()=>{
    $("#search_account").keyup(function(e){
        if(this.value ==  null || this.value == "" || this.value == typeof undefined){
            $("#display_details_area").addClass('d-none').transition('fade out');
            $('#show-list').html('');
        }else{
            e.preventDefault();
            let msisdn = `+265${this.value.substring(1, ($('#search_account').val().length))}`;
            liveSearch(msisdn,true);
        }
    })

    $("#initiateDepositButton").click(()=>{
        initiateDeposit();
    });
   
    

    $(".deposit_fields").on('keyup change',function(){
        let noteCount = this.value;
        if(noteCount == null || noteCount == "" || noteCount == typeof undefined){
            noteCount = 0;
        }
        
        try{
            noteCount = parseInt(noteCount);
            if(noteCount >= 0){
                $('.deposit_fields').removeClass('border border-danger border-10');
                const subtotal = (noteCount * $(this).attr('multiplier'));
                setSubtotals($(this).attr('outlet'), subtotal);
                $(`#${$(this).attr('outlet')}`).html(accounting.formatNumber(subtotal));
            }else{
                $(this).addClass('border border-danger border-10');
            }
        }catch(e){
            $(this).addClass('border border-danger border-10');
        }
        
    })
});

function setSubtotals(key, value){
    for(let index = 0; index < subtotals.length; index ++){
        if(subtotals[index].grouping == key){
            subtotals[index].value = value;
            break;
        }
    }
    let total = 0.00;
    subtotals.forEach(record=>{
        total += record.value;
    })
    $("#display_total").html(accounting.formatNumber(total));
    //console.log(subtotals);
}

function getTotalDepositAmount(){
    let total = 0.00;
    subtotals.forEach(record=>{
        total += record.value;
    })
    return total;
}

function initiateDeposit(){

    if($("#search_account").val() == "" || $("#search_account").val() == null || $("#search_account").val() == typeof undefined){
        swal('Attention!', "Please resolve the recepient account first!", 'warning')
        return;
    }

    if($("#deposit_amount").val() == "" || $("#deposit_amount").val() == null || $("#deposit_amount").val() ==  typeof undefined){
        swal('Attention!', "Please enter deposit amount!", 'warning')
        return;
    }

    if(parseFloat($("#deposit_amount").val()) < 100){
        swal('Attention!', "Deposit amount is less than the acceptable minimum of MK50.00", 'warning')
        return;
    }

  
    
    const depositParams = {
        'payee':window.TXN_ACC,
        'amount':parseFloat(getTotalDepositAmount())
    }
    

    if(parseFloat($("#deposit_amount").val()) != depositParams.amount){
        swal('Attention!', "The entered deposit amount is different from denominations sum!", 'warning')
        return;
    }
    
    let message = `Do you approve the deposit of MK${accounting.formatNumber(depositParams.amount)} to (${account_in_focus.firstname} ${account_in_focus.lastname} - ${depositParams.payee}) ?`;
    
    passwordConfirm(message, authPin=>{
        if(authPin){
            depositParams.authPIN = authPin;
            console.log(depositParams);
            $("#lauchDepositModalBtn").click();
            setTimeout(()=>{
                const options = {
                    method:"POST",
                    headers:{
                        'Content-Type':'application/json',
                    },
                    body:JSON.stringify(depositParams)
                }
                fetch(`${baseURL}/transactions/deposit`, options)
                .then(res=>res.json())
                .then(res=>{
                    $.notify(res.message, res.status)
                    swal('', res.message, res.status)
                    if(res.status == "success"){
                        $("#deposit_form, #first_form").trigger('reset');
                        $(".deposit_fields").val("");
                        notesValuesReset();
                    }
                }).catch(err=>{
                    console.log(err)
                    $.notify('Something went wrong while connecting to the server!', "error");
                    swal('Connection Error!', 'Something went wrong with the request!', "error");
                })
            }, 500)
        }
    } );
}

function notesValuesReset(){
    subtotals = [
                    {'grouping':'5k_total', 'value':0.00},
                    {'grouping':'10k_total', 'value':0.00},
                    {'grouping':'20k_total', 'value':0.00},
                    {'grouping':'50k_total', 'value':0.00},
                    {'grouping':'100k_total', 'value':0.00},
                    {'grouping':'200k_total', 'value':0.00},
                    {'grouping':'500k_total', 'value':0.00},
                    {'grouping':'1000k_total', 'value':0.00},
                    {'grouping':'2000k_total', 'value':0.00}
                ];
    setSubtotals();
}

