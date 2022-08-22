'use strict'

//const baseURL = `https://branch.mazikofintech.com`;
//const CORE_URL = 'https://core.mazikofintech.com/api/v1';

 const baseURL = `http://localhost:3000`;
 const CORE_URL = 'http://localhost:9090/api/v1';
 let selected_document_blob;
window.unload = function(e){
	e.preventDefault();
	const choice = prompt('Are you sure you\'ld like to exit the System?');
}

let TOKEN;
$(document).ready(()=>{
  pullToken()
  
	$(".phone-field").keyup(function(e){
        var sliced = $(this).val().slice(0,4)
        if(sliced != "+265" && sliced != "+255" && sliced != "+260"){
          $(this).val("+265");
        }
      });
      
      $(".phone-field").keydown(function(e){
          
            if($(this).val() == "+265"){
                var x=e.which||e.keycode;
                if(e.keyCode == 48){
                    try{
                        Toastify({
                            text: "Remember not to include zero (0) to the phone number!",
                            duration:4000,
                            gravity: "top", // `top` or `bottom`
                            position: 'right', // `left`, `center` or `right`
                            backgroundColor: "rgb(11, 89, 134)",
                            className: "info",
                          }).showToast();
                    }catch(e){
                        swal("Remember not to include zero (0) to the phone number");
                    }
                    e.preventDefault();
                }
            }else if((x>=48 && x<=57) || x==8 ||
            (x>=35 && x<=40)|| x==46){
                e.preventDefault();
            }
      });
});

function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

function load(text){
	$('body').loadingModal({
		text,
		animation:'cubeGrid'
	});
}

function stopLoad(){
	$('body').loadingModal('hide');
	$('body').loadingModal('destroy');
}

  

  function getFormData(form){
    let form_data = $("#"+form).serializeArray();
    let json_obj = {};
      $.each(form_data,
        function(i, v) {
            json_obj[v.name] = v.value;
      });
      return json_obj;
}

function passwordConfirm(message, callback){
	
    swal({
        title: "Authorize!",
        text: message,
        type: "input",
        showCancelButton: true,
		    closeOnConfirm: true,
		    confirmButtonText:'Authorize!',
        inputType:'password',
        inputPlaceholder: "Enter Authorization PIN..."
      }, function (inputValue) {
		
        if (inputValue || inputValue != "" || inputValue != null || inputValue != typeof undefined) {
          callback(inputValue);
        }
        
      });

}
function Confirm(message, callback){
	
  swal({
      title: "Confirm!",
      text: message,
      showCancelButton: true,
      closeOnConfirm: true,
      confirmButtonText: "Proceed",
      cancelButtonText: "Cancel",
      animation: "slide-from-left",
    }, function (check) {
       callback(check)
    });

}

function HeaderMessage(text, status){
  let message = ` <div class="col-12 pr-2">
                <div class="alert alert-${status} alert-dismissible fade show" role="alert">
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    ${text}
                </div>`
  $("#alert-section").html(message)
}

function readURL(input, callback) {
    if (input.files.length > 0 && input.files.length <= 4) {
        $.each(input.files, function (i, v) {
            var reader = new FileReader();
            reader.onload = function (e) {
                callback(e.target.result)
            }
            reader.readAsDataURL(input.files[i]);
        });
    }
}


function toast(uthenga, status) {
    if (status == "error") {
      $('body').toast({
          title:"Error!",
          class: 'error',
          showProgress: 'top',
        classProgress: 'blue',
          message: uthenga,
          displayTime: 6000,
        });
    } else if (status == "success") {
        $('body')
          .toast({
          title:"Success!",
          class: 'success',
          showProgress: 'bottom',
          message: uthenga,
          displayTime: 6000,
        });
    }else if (status == "warning") {
      $('body').toast({
        title:"Attention!",
        class: 'warning',
        showProgress: 'bottom',
        message: uthenga,
        displayTime: 6000,
      });
    }else if (status == "default") {
      $('body').toast({
          title:"Hey!,",
          class: 'blue',
          showProgress: 'bottom',
          message: uthenga,
          displayTime: 6000,
        });
  }

}


function pullToken(){
  try{
    TOKEN = localStorage.getItem('TOKEN')
  }catch{
    console.log('No Token to pull!')
  }
}