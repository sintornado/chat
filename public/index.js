var socket = io();
function setUsername(){
    socket.emit('setUsername',  document.getElementById('name').value);
};

function colorUser(){
  var letters = '0123456789ABCDEF';
  var color = '#';
      for (var i = 0; i < 6; i++){
        color += letters[Math.floor(Math.random() * 16)];
      };
  return color;
};
var user;

socket.on('userExists', function (data){
    document.getElementById('error').innerHTML = data;
});

socket.on('userSet', function (data){
    // var newUsers =  
    console.log(data);
    user = data.userName;
    document.body.innerHTML = '\
    <nav class="navbar navbar-inverse">\
    <div class="container-fluid">\
      <div class="navbar-header">\
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">\
          <span class="icon-bar"></span>\
          <span class="icon-bar"></span>\
          <span class="icon-bar"></span>\
        </button>\
        <a class="navbar-brand" href="#">simpleCHAT</a>\
      </div>\
      <div class="collapse navbar-collapse" id="myNavbar">\
        <ul class="nav navbar-nav">\
          <li class="active"><a href="#">Home</a></li>\
          <li><a href="#">About</a></li>\
          <li><a href="#">Projects</a></li>\
          <li><a href="#">Contact</a></li>\
        </ul>\
        <ul class="nav navbar-nav navbar-right">\
          <li><a href="#"><span class="glyphicon glyphicon-log-in"></span> Login</a></li>\
        </ul>\
      </div>\
    </div>\
  </nav>\
  <div class="container-fluid text-center">\
    <div class="row content">\
      <div class="col-sm-3 sidenav">\
      <h3>Сейчас в чате:</h3> \
      <div id="left-column"></div> \
      </div>\
      <div class="col-sm-6 text-left"> \
        <h1>Welcome</h1>\
        <input type="text" class="form-control" id="message" placeholder="Пиши здесь..."> \
        <button type="button" class="btn btn-primary" name="button" onclick="sendMessage()">Отправить</button> \
        <div id="message-container"></div> \
        <a href="/" class="btn btn-info btn-lg" onclick="logOutUser()">\
        <span class="glyphicon glyphicon-log-out"></span> Выйти \
        </a>\
        <hr>\
      </div>\
      <div class="col-sm-3 sidenav">\
        <div class="well">\
          <p>Приватный чат:</p>\
          <div id="privat"></div>\
        </div>\
      </div>\
    </div>\
  </div>\
  <footer class="container-fluid text-center">\
    <p>SimpleChat @ 2017</p>\
  </footer>';
});



function sendMessage(){
    var messageData = document.getElementById('message').value;
    if(messageData){
        socket.emit('message', {user: user, message: messageData});
    };
    document.getElementById('message').value = '';
};

function logOutUser(){
    if(user){
        socket.emit('userOutChat', {user:user});
    };
};

function privateTalk(user){
    var privatDivTalk = document.getElementById('privat');
    var privatDiv = document.createElement('div');

    var input = document.createElement("input");
        input.className = "form-control";
        input.type = "text";
        input.placeholder = "Write here....";
        input.id = "privatMessage";

    var button = document.createElement("button");
        button.className = "btn btn-primary";
        button.type = "button";
        button.innerText = "Send";
        button.onclick = function(){
          sendPrivatMessage();
        };

    var privatMassageDiv = document.createElement('div');
        privatMassageDiv.id = 'privatMassage';

        privatDiv.appendChild(input);
        privatDiv.appendChild(button);    
        privatDiv.appendChild(privatMassageDiv);

    privatDivTalk.appendChild(privatDiv);
};

function sendPrivatMessage(){
    var privatMessageData = document.getElementById('privatMessage').value;
      if(privatMessageData){
        socket.emit('privatMessage', {user: user, message: privatMessageData});
      };
    document.getElementById('privatMessage').value = '';
};

function drawUsers(users){
    var usersDiv = document.getElementById('left-column');
    usersDiv.innerHTML = "";
    for(var i=0;i<=users.length-1;i++){
      var user = users[i];
      var userDiv = document.createElement('div');
          userDiv.innerHTML = user;
          userDiv.style = 'color:' + colorUser() + ';';
          userDiv.id = 'userDiv';
          userDiv.onclick = function(){
            var oneUser = document.getElementById('userDiv').value;
            privateTalk(oneUser);
          };
      usersDiv.appendChild(userDiv);  
    };
};

socket.on('newUser', function(data){
    console.log(data);
    if(user){
      var users = JSON.parse(data.users);
      console.log(users);
      console.log(data);
      drawUsers(users);
    };
});

socket.on('messageOutUser', function(data){
    if(user){
    document.getElementById('left-column').innerHTML += data.user + ' Вышел из чата' + '<br>';
    };
});


socket.on('newMessage', function(data){
    if(user){
    document.getElementById('message-container').innerHTML += '<div>' + Date() + ' <b>' +  data.user  + '</b>: ' + data.message + '</div>'
    };
});

