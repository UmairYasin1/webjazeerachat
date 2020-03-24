//code for checking unique username and email.
// also for verifying deatils.
$(function(){

    var socket = io('/agent');
  
    var  eflag = pflag = 1;
  
    //checking for email.
    // $('#agent_email').keyup(function(){
  
    //   var email = $('#agent_email').val();
    //   var atpos = email.indexOf("@");
    //   var dotpos = email.lastIndexOf(".");
  
    //   if (atpos < 1 || dotpos < atpos+2 || dotpos+2 >= email.length){
    //     eflag = 0;
    //     $('#ik1').hide();
    //     $('#ir1').show();
    //     $('#error1').show().text("Please Enter Valid Email.");
    //   }
    //   else{
    //     socket.emit('checkAgentEmail',email);
    //     socket.on('checkAgentEmail',function(data){
    //       if(data == 1){
    //         eflag = 1;
    //         $('#ik1').show();
    //         $('#ir1').hide();
    //         $('#error1').hide();
    //       }
    //       else{
    //         eflag = 0;
    //         $('#ik1').hide();
    //         $('#ir1').show();
    //         $('#error1').show().text("Email Already Exists. Please, Change.");
    //       }
    //     });
    //   }
    // }); //end of checking for email.
  
    // //checking password.
    // $('#password').keyup(function(){
    //   var pass = $('#password').val();
    //   if(pass.length < 5){
    //     pflag = 0;
    //     $('#ik2').hide();
    //     $('#ir2').show();
    //     $('#error1').show().text("Password Should Have Atleast 5 Characters.");
    //   }
    //   else{
    //     pflag = 1;
    //     $('#ik2').show();
    //     $('#ir2').hide();
    //     $('#error1').hide();
    //   }
    // }); //end of checking password.
  
    //on form submit code.
    $('form').submit(function(){
      //validate action.
      if(eflag == 1 && pflag == 1){
        return true;
      }
      else{
        $('#error1').show().text("Input Is Incorrect. Please, Change.");
        return false;
      }
    });
  
  });//end of function.
  