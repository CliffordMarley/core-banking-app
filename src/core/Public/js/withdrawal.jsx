
"use strict";

$(document).ready(()=>{
    $("#withdrawal_amount").keyup(function(){
        $("#amount_to_word").html(toWordsconver(this.value).toUpperCase()+" KWACHA");
    });

    $("#initiateWithdrawalBtn").click(()=>{
        initiateWithdrawal();
    });$("#search_account").keyup(function(e){
        if(this.value ==  null || this.value == "" || this.value == typeof undefined){
            $("#display_details_area").addClass('d-none').transition('fade out');
          
            $('#show-list').html('');
        }else{
            e.preventDefault();
            let searchValue = `265${this.value.substring(1, ($('#search_account').val().length))}`;
            liveSearch(searchValue,true);
        }
    })

    $("#search_account").keyup(function(e){
        if(this.value ==  null || this.value == "" || this.value == typeof undefined){
            $("#display_details_area").addClass('d-none').transition('fade out');
          
            $('#show-list').html('');
        }else{
            e.preventDefault();
            let searchValue = `265${this.value.substring(1, ($('#search_account').val().length))}`;
            liveSearch(searchValue,true);
        }
    })
});


function initiateWithdrawal(){
    const primary_phone = account_in_focus.phone_numbers.filter((phone_array)=>{
        return phone_array.priority == 'PRIMARY';
    })
    
    const withdrawalParams = {
        'payer':account_in_focus.account_number,
        'amount':$("#withdrawal_amount").val()
    }

    if(withdrawalParams.amount == null || withdrawalParams.amount == "" || withdrawalParams.amount == typeof undefined){
        swal('Attention!', "Invalid withdrawal amount", 'warning')
        return;
    }

    
    if(withdrawalParams.amount < 100 ){
        swal('Attention!', "Withdrawal amount is less than the acceptable minimum of MK100.00", 'warning')
        return;
    }

    let message = `Do you approve the withdrawal of MK${accounting.formatNumber(withdrawalParams.amount)} by (${account_in_focus.firstname} ${account_in_focus.lastname} - ${primary_phone}) ?`;

    passwordConfirm(message, authPin=>{
        if(authPin && authPin != 'error'){
            withdrawalParams.authPIN = authPin;
            console.log(withdrawalParams);
            $("#cashWithdrawalBtn").click();
            setTimeout(()=>{
                $.ajax({
                    url:`${baseURL}/transactions/withdrawal`,
                    method:"POST",
                    dataType:"json",
                    data:withdrawalParams,
                    beforeSend:()=>{
                        load('Processing Withdrawal Parameters...');
                    },success:(response)=>{
                       stopLoad()
                        if(response.status == "success"){
                            stopLoad();
                            $("#withdrawal_amount").val('');
                            swal('Transaction Complete!', response.message, response.status);
                            fetchTransactions('account_number='+withdrawalParams.account_number);
                        }else{
                            $("#cashWithdrawalBtn").click();
                            swal('Transaction Failed!', response.message, 'error');
                        }
                    },error:(e)=>{
                        stopLoad();
                        $("#cashWithdrawalBtn").click();
                        swal('Connection Error!', 'Something went wrong while connecting to the server!', "error");
                    }
                });
            }, 500)
        }
    } );
}