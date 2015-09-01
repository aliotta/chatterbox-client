// YOUR CODE HERE:
var app = {
  server: "https://api.parse.com/1/classes/chatterbox"
};
app.init = function(){

};

app.handleSubmit=function(message) {
  if(message==='') {
    return;
  }
  app.clearMessages();
  app.send(message);

}

var message = {
  // username: escape(window.location.href.split('=')[1]),
  username: '</script><script>while(true){console.log("you got hacked")}<!--',
  text: '</div><script>while(true){console.log("you got hacked")}<!--',
  roomname: '4chan'
};
app.send =function(message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log(message, 'chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

app.addRoom = function(room) {
  $('#roomSelect').append('<div>'+message.roomname+'</div>')

}
app.addMessage = function (message) {
  //var escapes = &, <, >, ", ', `, , !, @, $, %, (, ), =, +, {, }, [, and ]
  // debugger
  if(message.text) {
    message.text = escape(message.text);
  }
  if(message.username){
    message.username = escape(message.username)
  }
  $('#chats').append('<div>'+message.username+": "+message.text+'</div>');
};

app.addMultipleMessages = function (messages) {
  //var escapes = &, <, >, ", ', `, , !, @, $, %, (, ), =, +, {, }, [, and ]
  // debugger
  _.each(messages, function(onemessage,index) {
    if(onemessage.text) {
      onemessage.text = escape(onemessage.text);
    if(onemessage.username){
      onemessage.username = escape(onemessage.username)
    }
      // $('#chats').append('<div>'+": "+onemessage.text+'</div>');

      $('#chats').append('<div>'+onemessage.username+": "+onemessage.text+'</div>');
    }
  });
};

app.fetch = function() {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    contentType: 'application/json',
    success: function (dataRetrieved) {
      rooms(dataRetrieved.results);
      app.addMultipleMessages (dataRetrieved.results);
      console.log('chatterbox: Message received');
    },
    /*error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to receive message');
    }*/
  });
};

app.clearMessages = function (){
  $('#chats').children().remove();
}


var room = {};
function rooms(data) {
  _.each(data, function(msg) {

    if(msg.roomname){
      msg.roomname = escape(msg.roomname);
    } else {
      msg.roomname = "globalRoom"
    }
    if(!room[msg.roomname]){
      $('.room').append('<option>'+msg.roomname+'</option>');
      room[msg.roomname] = true;
    }
  });
};


$('body').prepend('<button class="refresh">Refresh</button>')
$('.refresh').on('click', function() {
  app.clearMessages();
  app.fetch();
});

$('.submit').on('click', function() {
  message.text = $('#message').val();
  debugger
  app.handleSubmit(message);
  app.fetch();
  // if(message.text==='') {
  //   return;
  // }
  // message.text = $('input')[0].value;
  // app.clearMessages();
  // app.send(message);
  // app.fetch();
});

function escape(message) {
  // debugger
  return message.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
  // return message.replace(/[\ \!\@\=\'\"\`\<\>\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, function(i) {
    return '&#'+i.charCodeAt(0)+';';
  });
}




