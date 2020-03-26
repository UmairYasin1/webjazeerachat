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
          
          console.log(visitor_name);

          socket.emit('get_visitor_id',visitor_name, function (response) {

           // var txt1 = $('<button id="ubtn" class="btn btn-success  btn-md">').text(response.visitor_name).attr("rel" , response.visitor_id).css({"font-size":"18px"});

            if(stack[response.visitor_name] == "Online"){
            //  var txt2 = $('<span class="badge"></span>').text("*"+stack[response.visitor_name]).css({"float":"right","color":"#009933","font-size":"18px"});
             

              var a = '<tr><td><a href="javascript:;"><img src="/pics/clickicon.png" alt="-" /></a></td><td><span class="userNameIntable"><a href="javascript:;" id="ubtn" rel='+response.visitor_id+'>'+response.visitor_name+'</a></span></td><td><img src="/pics/statsintable.jpg" alt="-" /></td><td>1hr 3 mins</td><td>'+response.agent_name+'</td><td>Uptown Logo Design | Client Area..</td><td><img src="/pics/gicon.png" alt="-" />  google.com</td><td>99</td><td>1</td></tr>';
              totalOnline++;
      
            }
            else{
              var a = '<tr><td><a href="javascript:;"><img src="/pics/clickicon.png" alt="-" /></a></td><td><span class="userNameIntable"><a href="javascript:;" id="ubtn" rel='+response.visitor_id+'>'+response.visitor_name+'</a></span></td><td><img src="/pics/statsintable.jpg" alt="-" /></td><td>1hr 3 mins</td><td>'+response.agent_name+'</td><td>Uptown Logo Design | Client Area..</td><td><img src="/pics/gicon.png" alt="-" />  google.com</td><td>99</td><td>1</td></tr>';
              
            //  var txt2 = $('<span class="badge"></span>').text(stack[response.visitor_name]).css({"float":"right","color":"#a6a6a6","font-size":"18px"});
            }

            //listing all users.
            //$('#list').append($('<li>').append(txt1,txt2));

            $('.ChatTable table tbody').append(a);

            $('#totalOnline').text(totalOnline);

        });

        //   socket.emit('set', 'is_it_ok', function (response) {
        //     console.log(response);
        // });
  


          
         
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
    //on button click function.
    // $(document).on("click","#ubtn",function(){
  
    //   //empty messages.
    //   $('#messages').empty();
    //   $('#typing').text("");
    //   msgCount = 0;
    //   noChat = 0;
    //   oldInitDone = 0;
  
    //   //assigning friends name to whom messages will send,(in case of group its value is Group).
    //   toUser = $(this).text();
    //   visitor_id = $(this).attr("rel");

    //   $("#toVisitor").val(toUser);
  
    //   //showing and hiding relevant information.
    //   $('#frndName').text(toUser);
    //   $('#initMsg').hide();
    //   $('#chatForm').show(); //showing chat form.
  
    //   //assigning two names for room. which helps in one-to-one and also group chat.
    //   if(toUser == "Group"){
    //     var currentRoom = "Group-Group";
    //     var reverseRoom = "Group-Group";
    //   }
    //   else{
    //     var currentRoom = username+"-"+toUser;
    //     var reverseRoom = toUser+"-"+username;
    //   }
    //   //console.log(agent_id);
    //   socket.emit('update-room',{ visitor_id : visitor_id , agent_id : agent_id , agent : username});
  
    //   //event to set room and join.
    //   //socket.emit('set-room',{name1:currentRoom,name2:reverseRoom});
  
    // }); //end of on button click event.
  
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
    $('#scrl2').scroll(function(){
  
      if($('#scrl2').scrollTop() == 0 && noChat == 0 && oldInitDone == 1){
        $('#loading').show();
        socket.emit('old-chats',{room:roomId,username:username,msgCount:msgCount});
      }
  
    }); // end of scroll event.
  
    //listening old-chats event.
    socket.on('old-chats',function(data){
  
      if(data.room == roomId){
        oldInitDone = 1; //setting value to implies that old-chats first event is done.
        if(data.result.length != 0){
          $('#noChat').hide(); //hiding no more chats message.
          for (var i = 0;i < data.result.length;i++) {
            //styling of chat message.
            var chatDate = moment(data.result[i].createdOn).format("MMMM Do YYYY, hh:mm:ss a");
            var txt1 = $('<span></span>').text(data.result[i].msgFrom+" : ");
            var txt2 = $('<span></span>').text(chatDate);
            var txt3 = $('<p></p>').append(txt1,txt2);
            var txt4 = $('<p></p>').text(data.result[i].msg);
            if(data.result[i].file != ''){
              var txt5 = $("<img>").attr("src" , "/uploads/" + data.result[i].file);
              }else{
                var txt5 = "";
              }
            //showing chat in chat box.
            $('#messages').prepend($('<li>').append(txt3,txt4,txt5));
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
          // url: "http://localhost:5000/upload/file",
          url: "https://umairyasin1-dinochat.glitch.me/upload/file",
          data: formData,
          processData: false,
          contentType: false,
          success: function(result){
            if(result.file == ""){
              toVisit = $("#toVisitor").val();
              socket.emit('chat-msg',{msg:result.message,msgTo:toVisit,date:Date.now(),type:"agent",file:""});
            }else{
              toVisit = $("#toVisitor").val();
              socket.emit('chat-msg',{msg:result.message,msgTo:toVisit,date:Date.now(),type:"agent",file:result.file});
            }
          },
          error: function (e) {
              console.log("some error", e);
          }
      });

      
      $('#myMsg').val("");
      return false;
    }); //end of sending message.

    //receiving messages.
    socket.on('chat-msg',function(data){
      //styling of chat message.
      var chatDate = moment(data.date).format("MMMM Do YYYY, hh:mm:ss a");
      var txt1 = $('<span></span>').text(data.msgFrom+" : ");
      var txt2 = $('<span></span>').text(chatDate);
      var txt3 = $('<p></p>').append(txt1,txt2);
      var txt4 = $('<p></p>').text(data.msg);
      if(data.file != ""){
        var txt5 = $("<img>").attr("src" , "/uploads/" + data.file);
        }else{
          var txt5 = "";
        }

 
      //showing chat in chat box.
      $('#messages').append($('<li>').append(txt3,txt4,txt5));
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
  