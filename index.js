// const server = require('http').createServer();
// const io = require('socket.io')(server);
// io.on('connection', client => {
//   client.on('event', data => { /* … */ });
//   client.on('disconnect', () => { /* … */ });
// });
// server.listen(3000);





//old

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

io.set('transports', ['websocket', 'xhr-polling', 'jsonp-polling', 'htmlfile', 'flashsocket']);
io.set('origins', '*:*');

//默认打开页面
app.get('/',function(req,res){
    res.sendfile('index.html');
});

app.get('/public',function(req,res){
    res.sendfile('./public/index.html');
});



//存储socket广播数据
var iolist = [];

//定义socket on connection 连入事件行为
io.on('connection',function(socket){
    //讲链接加入列表
    iolist.push(socket);
    //记录index断开时删除对应socket
    socket.on('disconnect',function(){
        iolist.splice(socket,1);
    })
    //testone 为前端定义的名字
    socket.on('testone',(str) =>{
        console.log({msg:str,id:socket.id});
    })
})

//数据广播 1s一次
setInterval(function(){
    if(iolist.length <= 0) return;
    var trends = fs.readFileSync('./data/trends.json','utf-8');
    var coins = fs.readFileSync('./data/coins.json','utf-8');
    //向所有socket连接发送数据
    for (i in iolist) {
        // 向客户端发送trends数据
        iolist[i].emit('trends', trends);
        // 向客户端发送coins数据
        iolist[i].emit('coins', coins);
    }
}, 1000);






//服务器侦听在sockettest.com的3000端口上
http.listen(3000, function(){
    // 输出到标准输出
    console.log('listening on *:3000');
});


