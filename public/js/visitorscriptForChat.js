$ (function(){

    var socket = io('/chat');

    var visitorname = $('#visitor').val();
    var visitorId = $('#visitor_id').val();
    var noChat = 0; //setting 0 if all chats histroy is not loaded. 1 if all chats loaded.
    var msgCount = 0; //counting total number of messages displayed.
    var oldInitDone = 0; //it is 0 when old-chats-init is not executed and 1 if executed.
    var roomId;//variable for setting room.
    var toUser;

      //passing data on connection.
  socket.on('connect',function(){
    socket.emit('set-user-data',visitorname);
    // setTimeout(function() { alert(username+" logged In"); }, 500);

    socket.on('broadcast',function(data){
    document.getElementById("hell0").innerHTML += '<li>'+ data.description +'</li>';
    // $('#hell0').append($('<li>').append($(data.description).append($('<li>');
    $('#hell0').scrollTop($('#hell0')[0].scrollHeight);

});

  });//end of connect event.

  var currentRoom = visitorId;
  var reverseRoom = "";
  socket.emit('set-room',{name1:currentRoom,name2:reverseRoom});

   //event for setting roomId.
   socket.on('set-room',function(room){
    //empty messages.
    $('#messages').empty();
    $('#typing').text("");
    msgCount = 0;
    noChat = 0;
    oldInitDone = 0;
    //assigning room id to roomId variable. which helps in one-to-one and group chat.
    roomId = room;
    console.log("roomId : "+roomId);
    //event to get chat history on button click or as room is set.
    socket.emit('old-chats-init',{room:roomId,username:visitorname,msgCount:msgCount});

  }); //end of set-room event.


    //on scroll load more old-chats.
    $('#scrl2').scroll(function(){

        if($('#scrl2').scrollTop() == 0 && noChat == 0 && oldInitDone == 1){
          $('#loading').show();
          socket.emit('old-chats',{room:roomId,username:visitorname,msgCount:msgCount});
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
        console.log(msgCount);
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

  

    //sending message.
  $('#visitorchatForm').submit(function(e){
 
    e.preventDefault();
    var formData = new FormData(this);

    $.ajax({
      type: "POST",
      url: "http://192.168.1.110:5000/upload/file",
      data: formData,
      processData: false,
      contentType: false,
      success: function(result){
        if(result.file == ""){
          console.log("1");
          socket.emit('chat-msg',{msg:result.message,msgTo:"",date:Date.now(),type:"visitor",file:""});
        }else{
          console.log("2");
          socket.emit('chat-msg',{msg:result.message,msgTo:"",date:Date.now(),type:"visitor",file:result.file});
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
    console.log(data.file);
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