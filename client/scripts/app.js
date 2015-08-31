// YOUR CODE HERE:
var message = {
  username: 'dd',
  text: '</div><script>while(true){console.log("you got hacked")}<!--',
  roomname: '4chan'
};
function post() {
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

function update() {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    contentType: 'application/json',
    success: function (dataRetrieved) {
      placemessage (dataRetrieved.results);
      console.log('chatterbox: Message received');
    },
    /*error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to receive message');
    }*/
  });
};

function placemessage(messages) {
  //var escapes = &, <, >, ", ', `, , !, @, $, %, (, ), =, +, {, }, [, and ]
  
  _.each(messages, function(onemessage,index) {
    if(onemessage.text) {
      onemessage.text = onemessage.text.replace(/[\ \!\@\=\'\"\`\<\>\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
      $('#chats').append('<div>'+onemessage.username+": "+onemessage.text+'</div>');
    }
  })
}

$('body').prepend('<button class="refresh">Refresh</button>')
$('.refresh').on('click', function() {
  $('#chats').children().remove();
  update();
});

$('body').prepend('<button class="post">Post</button>')
$('.post').on('click', function() {
  $('#chats').children().remove();
  post();
  update();
});