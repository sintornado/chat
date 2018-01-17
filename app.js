var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

var users = {};

function makeUsersList(users){
    var userInChat=[];
    for(var name in users){
        userInChat.push(name);
    }
    return userInChat;
};
io.on('connection', function(socket){
    console.log('A user connected');
    console.log(socket.id);
    socket.on('setUsername', function(data){
        console.log(data);
            if(users[data] !== undefined){
                console.log(data);
            socket.emit('userExists', '<p class="bg-primary>Пользователь' + '<b>' + data + '</b>' + 'уже существует, выбери другое имя!</p>');
            }else{
                users[data] = socket;
                //console.log(users);
                socket.emit('userSet', {userName: data});
                console.log('Sucessfully sent');
                io.sockets.emit('newUser', {users: JSON.stringify(makeUsersList(users))});
                console.log(data);
            };
    });

    socket.on('message', function(data){
        io.sockets.emit('newMessage', data);
    });

    socket.on('userOutChat', function(data){
        console.log(data.user + ' disconnected');
        //console.log(users);
        // users.pop(data);
        io.sockets.emit('messageOutUser', data);
    });

    // socket.on('privatUser', function(data){
    //     var findPrivatUser = users.data;
    //     io.sockets.sockets[findPrivatUser].emit('privat', {userName: data});
    // });

});
http.listen(3000, function(){
    console.log('listening on port:3000');
});