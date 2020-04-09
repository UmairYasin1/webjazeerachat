$ (function(){

    var socket = io('/chat');
  
    var username = $('#agent').val();
    var agent_id = $('#agent_id').val();
    var noChat = 0; //setting 0 if all chats histroy is not loaded. 1 if all chats loaded.
    var msgCount = 0; //counting total number of messages displayed.
    var oldInitDone = 0; //it is 0 when old-chats-init is not executed and 1 if executed.
    var roomId;//variable for setting room.

  
    //passing data on connection.
    socket.on('connect',function(){
      socket.emit('set-user-data',username);
      // setTimeout(function() { alert(username+" logged In"); }, 500);
  
      socket.on('broadcast',function(data){
      document.getElementById("hell0").innerHTML += '<li>'+ data.description +'</li>';
      // $('#hell0').append($('<li>').append($(data.description).append($('<li>');
      $('#hell0').scrollTop($('#hell0')[0].scrollHeight);
  
  });
  
    });//end of connect event.
  
  
  
    //receiving onlineStack.
    socket.on('onlineStack',function(stack){
      $('.ChatTable table tbody').empty();
     // $('#list').empty();
     // $('#list').append($('<li>').append($('<button id="ubtn" class="btn btn-danger btn-block btn-lg"></button>').text("Group").css({"font-size":"18px"})));
      var totalOnline = 0;
    
      for (var visitor_name in stack){
        
       // console.log(visitor_name);
    
        //setting txt1. shows users button.
        if(visitor_name == username){
         // var txt1 = $('<button class="boxF disabled"> </button>').text(visitor_name).css({"font-size":"18px"});
        }
        else{
          socket.emit('get_visitor_id',visitor_name, function (response) {

           // var txt1 = $('<button id="ubtn" class="btn btn-success  btn-md">').text(response.visitor_name).attr("rel" , response.visitor_id).css({"font-size":"18px"});

            if(stack[response.visitor_name] == "Online"){
            //  var txt2 = $('<span class="badge"></span>').text("*"+stack[response.visitor_name]).css({"float":"right","color":"#009933","font-size":"18px"});
             

              var a = '<tr><td><a href="javascript:;"><img src="/pics/clickicon.png" alt="-" /></a></td><td><span class="userNameIntable"><a href="javascript:;" id="ubtn" rel='+response.visitor_id+'>'+response.visitor_name+'</a><i class="fa fa-check-circle-o" aria-hidden="true"></i></span></td><td><img src="/pics/statsintable.jpg" alt="alternative text" title="Country : '+ response.country +', Browser : '+ response.browser +', OS : '+ response.os +', Platform : '+ response.platform +'" /></td><td>1hr 3 mins</td><td>'+response.agent_name+'</td><td>Logo Viction | Client Area..</td><td><img src="/pics/gicon.png" alt="-" />  google.com</td><td>99</td><td>1</td></tr>';
              totalOnline++;
      
            }
            else{
              var a = '<tr><td><a href="javascript:;"><img src="/pics/clickicon.png" alt="-" /></a></td><td><span class="userNameIntable"><a href="javascript:;" id="ubtn" rel='+response.visitor_id+'>'+response.visitor_name+'</a> <i class="fa fa-ban" aria-hidden="true"></i></span></td><td><img src="/pics/statsintable.jpg" alt="alternative text" title="Country : '+ response.country +', Browser : '+ response.browser +', OS : '+ response.os +', Platform : '+ response.platform +'" /></td><td>1hr 3 mins</td><td>'+response.agent_name+'</td><td>Logo Viction | Client Area..</td><td><img src="/pics/gicon.png" alt="-" />  google.com</td><td>99</td><td>1</td></tr>';
              //totalOnline++;
      
            //  var txt2 = $('<span class="badge"></span>').text(stack[response.visitor_name]).css({"float":"right","color":"#a6a6a6","font-size":"18px"});
            }

            //listing all users.
            //$('#list').append($('<li>').append(txt1,txt2));

            $('.ChatTable table tbody').append(a);

            $('#totalOnline').text(totalOnline);

        });

        }
        //setting txt2. shows online status.
      
      }//end of for.
      $('#scrl1').scrollTop($('#scrl1').prop("scrollHeight"));
    }); //end of receiving onlineStack event.
  
  
    $(document).on("click","#ubtn",function(){

      $('#messages').empty();
      $('#typing').text("");
      msgCount = 0;
      noChat = 0;
      oldInitDone = 0;

      toUser = $(this).text();
      visitor_id = $(this).attr("rel");

      $("#toVisitor").val(toUser);
      $('#frndName').text(toUser);
      //$('#initMsg').hide();

      socket.emit('update-room',{ visitor_id : visitor_id , agent_id : agent_id , agent : username});


    })
  
    //event for setting roomId.
    socket.on('update-room',function(room){
      //empty messages.
      $('#messages').empty();
      $('#typing').text("");
      msgCount = 0;
      noChat = 0;
      oldInitDone = 0;
      //assigning room id to roomId variable. which helps in one-to-one and group chat.
      roomId = room;
      //event to get chat history on button click or as room is set.
      socket.emit('old-chats-init',{room:roomId,username:username,msgCount:msgCount});
  
    }); //end of set-room event.
  
    //on scroll load more old-chats.
    // $('#scrl2').scroll(function(){
  
    //   if($('#scrl2').scrollTop() == 0 && noChat == 0 && oldInitDone == 1){
    //     $('#loading').show();
    //     socket.emit('old-chats',{room:roomId,username:username,msgCount:msgCount});
    //   }
  
    // }); // end of scroll event.
  
    //listening old-chats event.
    socket.on('old-chats',function(data){
      $(".replymsg").empty();
      if(data.room == roomId){
        oldInitDone = 1; //setting value to implies that old-chats first event is done.
        if(data.result.length != 0){
          $('#noChat').hide(); //hiding no more chats message.
          for (var i = 0;i < data.result.length;i++) {

                 socket.emit('get_reply_msg', data.result[i].msgId   , function (response) {

                   //styling of chat message.
                   var chatDate = moment(response.createdOn).format("MMMM Do YYYY, hh:mm:ss a");
                   var txt1 = $('<span></span>').text(response.msgFrom+" : ");
                   var txt2 = $('<span></span>').text(chatDate);
                   var txt3 = $('<p></p>').append(txt1,txt2);
                   var txt4 = $('<p></p>').text(response.msg);
                   if(response.file != ''){
                     var txt5 = $("<img style='height: 100px;width: 100px;'>").attr("src" , "/uploads/" + response.file);
                     }else{
                       var txt5 = "";
                     }
                   //showing chat in chat box.

                  var reschatDate = moment(response.repcreatedOn).format("MMMM Do YYYY, hh:mm:ss a");
                   var restxt1 = $('<span></span>').text(response.repmsgFrom+" : ");
                   var restxt2 = $('<span></span>').text(reschatDate);
                   var restxt3 = $('<p></p>').append(restxt1,restxt2);
                   var restxt4 = $('<p></p>').text(response.repmsg);
                   if(response.repfile != ''){
                     var restxt5 = $("<img style='height: 100px;width: 100px;'>").attr("src" , "/uploads/" + response.repfile);
                     }else{
                       var restxt5 = "";
                     }

                     if(response.msgFrom == ""){
                      $('#messages').prepend($('<li>').append(restxt3,restxt4,restxt5).attr("rel" , response.msgId));
                   
                     }else{
                      $('#messages').prepend($('<li>').append(restxt3,restxt4,restxt5).attr("rel" , response.msgId).append($("<ul class='replymsg'>").append($("<li>").append(txt3,txt4,txt5).attr("rel" , response.msgId))));
                   
                     }
                   
                   
              })

            
              //}
            //showing chat in chat box.
          
            msgCount++;
  
          }//end of for.
        }
        else {
          $('#noChat').show(); //displaying no more chats message.
          noChat = 1; //to prevent unnecessary scroll event.
        }
        //hiding loading bar.
        $('#loading').hide();
  
        //setting scrollbar position while first 5 chats loads.
        if(msgCount <= 5){
          $('#scrl2').scrollTop($('#scrl2').prop("scrollHeight"));
        }
      }//end of outer if.
  
    }); // end of listening old-chats event.
  
    //receiving typing message.
    socket.on('typing',function(msg){
      var setTime;
      //clearing previous setTimeout function.
      clearTimeout(setTime);
      //showing typing message.
      $('#typing').text(msg);
      //showing typing message only for few seconds.
      setTime = setTimeout(function(){
        $('#typing').text("");
      },3500);
    }); //end of typing event.
  
    //sending message.
    $('#chatForm').submit(function(e){

      e.preventDefault();
        var formData = new FormData(this);

        $.ajax({
          type: "POST",
          //url: "http://localhost:5000/upload/file",
          url: "https://umairyasin1-dinochat.glitch.me/upload/file",
          data: formData,
          processData: false,
          contentType: false,
          success: function(result){
            if(result.file == ""){
              toVisit = $("#toVisitor").val();
              socket.emit('chat-msg',{msg:result.message,msgTo:toVisit,date:Date.now(),type:"agent",file:"",repMsgId:result.replymsgId});
            }else{
              toVisit = $("#toVisitor").val();
              socket.emit('chat-msg',{msg:result.message,msgTo:toVisit,date:Date.now(),type:"agent",file:result.file,repMsgId:result.replymsgId});
            }

            $("#repMsgId").val("");
            $("#replyMsg").empty();
            $("#photos-input").val("");
          },
          error: function (e) {
              console.log("some error", e);
          }
      });

      
      $('#myMsg').val("");
      return false;
    }); //end of sending message.

    // $(document).on("click","#messages li",function(){
    //   $('#replyMsg').empty();
    //   var msgId = $(this).attr("rel");

    //   //console.log(msgId);
    //   socket.emit('get_reply_msg',msgId , function (response) {
    //       //styling of chat message.
    //       var chatDate = moment(response.repcreatedOn).format("MMMM Do YYYY, hh:mm:ss a");
    //       var txt1 = $('<span></span>').text(response.repmsgFrom+" : ");
    //       var txt2 = $('<span></span>').text(chatDate);
    //       var txt3 = $('<p></p>').append(txt1,txt2);
    //       var txt4 = $('<p></p>').text(response.repmsg);
    //       if(response.repfile != ''){
    //         var txt5 = $("<img>").attr("src" , "/uploads/" + response.repfile);
    //         }else{
    //           var txt5 = "";
    //         }
    //       //showing chat in chat box.
    //       $('#replyMsg').prepend($('<li>').append(txt3,txt4,txt5).attr("rel" , response.msgId ));
    //       $("#repMsgId").val(response.msgId);
    //   })
    // })

    //receiving messages.
    socket.on('chat-msg',function(data){
      //styling of chat message.
      var chatDate = moment(data.date).format("MMMM Do YYYY, hh:mm:ss a");
      var txt1 = $('<span></span>').text(data.msgFrom+" : ");
      var txt2 = $('<span></span>').text(chatDate);
      var txt3 = $('<p></p>').append(txt1,txt2);
      var txt4 = $('<p></p>').text(data.msg);
      if(data.file != ""){
        var txt5 = $("<img style='height: 100px;width: 100px;'>").attr("src" , "/uploads/" + data.file);
        }else{
          var txt5 = "";
        }

        if(username == data.msgFrom){
          var clas = "sent";
        }else{
          var clas = "replies";
        }
      
      if(data.repMsg != ""){

        var replychatDate = moment(data.repDate).format("MMMM Do YYYY, hh:mm:ss a");
        var replytxt1 = $('<span></span>').text(data.repFrom+" : ");
        var replytxt2 = $('<span></span>').text(replychatDate);
        var replytxt3 = $('<p></p>').append(replytxt1,replytxt2);
        var replytxt4 = $('<p></p>').text(data.repMsg);
        if(data.repfile != ""){
          var replytxt5 = $("<img style='height: 100px;width: 100px;'>").attr("src" , "/uploads/" + data.repfile);
          }else{
            var replytxt5 = "";
          }

        $('#messages').append($('<li class='+clas+'>').append(replytxt3,replytxt4,replytxt5).attr("rel" , data.id).append($("<ul class='replymsg'>").append($("<li>").append(txt3,txt4,txt5))));

      }else{
        
        $('#messages').append($('<li class='+clas+'>').append(txt3,txt4,txt5).attr("rel" , data.id));
      }
 
      //showing chat in chat box.
      
        msgCount++;
        console.log(msgCount);
        $('#typing').text("");
        $('#scrl2').scrollTop($('#scrl2').prop("scrollHeight"));
    }); //end of receiving messages.
  
    //on disconnect event.
    //passing data on connection.
    socket.on('disconnect',function(){
  
  
      //showing and hiding relevant information.
      $('#list').empty();
      $('#messages').empty();
      $('#typing').text("");
      $('#frndName').text("Disconnected..");
      $('#loading').hide();
      $('#noChat').hide();
      $('#initMsg').show().text("...Please, Refresh Your Page...");
      $('#chatForm').hide();
      msgCount = 0;
      noChat = 0;
    });//end of connect event.
  
  
  
  });//end of function.
  