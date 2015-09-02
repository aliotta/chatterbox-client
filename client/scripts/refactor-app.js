var Message = Backbone.Model.extend({
  initialize: function(input) {
    this.set('username', escape(input['username']));
    this.set('text', escape(input['text']));
    this.set('roomname', escape(input['roomname']));
  },
});

// var MessageView = Backbone.View.extend({
//   initialize: function() {
//     this.model.on('change', this.render, this);
//   },
//   render: function() {
//     // this.$el.id='chats';
//     var html = [
//       '<div class="chat" room='+this.model.get('roomname')+'>',
//         '<div class="username">'+this.model.get('username')+':</div>',
//       this.model.get('text')+'</div>'
//     ].join('');
//     return this.$el.html(html);
//   }
// });


var Messages = Backbone.Collection.extend({
  model: Message,
  url: "https://api.parse.com/1/classes/chatterbox",
  loadMessages: function() {
    this.fetch();
  },
  sendMessage: function(message) {
    this.create(message);
    this.loadMessages();
  },
  clearMessages: function() {
    $('#chats >div').children().remove();
  },
  parse: function(response) {
    return response.results;
  }
});

var MessagesView = Backbone.View.extend({
  initialize: function() {
    this.model.on('sync', this.render, this);
  },
  render: function() {
    this.model.clearMessages();
    this.$el.addClass('collection');
    this.$el.append(this.model.map(function(message) {
      rooms(message);
      return ['<div class="chat collection-item" room='+message.get('roomname')+'>',
        '<div class="username">'+message.get('username')+':</div>',
      message.get('text')+'</div>'].join('')
    }))
    changeroom();
    addfriendlistener();
    turnfriendsbold();
    return this.$el;
  }
});

  var messages = new Messages();
  messages.loadMessages();
  var messagesView; 
  messagesView = new MessagesView({model: messages});
  $('#chats').append(messagesView.render());


$('.refresh').on('click', function() {
  // debugger
  messages.loadMessages();
});

$('.submit').on('click', function() {
  var message = {};
  message.username = window.location.href.split('=')[1]
  message.text = $('#message').val();
  message.roomname = '4chan'
  messages.sendMessage(message);
});


function escape(message) {
  // debugger
  if(!message) {return;}
  return message.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
    return '&#'+i.charCodeAt(0)+';';
  });
}




var room = {};
function rooms(data) {
  if(data.get('roomname')){
    data.set('roomname', data.get('roomname'));
  } else {
    data.set('roomname', 'lobby');
  }
  if(!room[data.get('roomname')]){
    $('.room').append('<option>'+data.get('roomname')+'</option>');
    room[data.get('roomname')] = true;
  };
};


function changeroom() {
  var currentroom = $('select').val();
  if(currentroom==='lobby') {
    _.each($('#chats >div >div'), function(d) {
      d.hidden = false;
    });
  } else {
    _.each($('#chats >div >div'), function(d) {
      if(currentroom !== d.getAttribute('room')) {
        d.hidden = true;
      } else {
        d.hidden = false;
      }
    });
  }
}

var friends = {};
function addfriendlistener() {
  $('.username').on('click', function() {
    var friendName = this.innerText
    if(friends[friendName]) {
      return;
    }
    friends[friendName] = true;
    turnfriendsbold();
  });
}

function turnfriendsbold() {
  _.each($('.chat'), function(chat) {
    if(chat.children[0].innerText in friends) {
      chat.children[0].classList.add('blue-text');
    }    
  });
}
