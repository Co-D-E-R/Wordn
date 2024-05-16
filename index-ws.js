const express = require('express');
const server = require('http').createServer();
const app = express();


app.get('/',(req,res)=>{
    res.sendFile('index.html',{root: __dirname});
});

server.on('request',app);
server.listen(3000,()=>{
    console.log("server started on port 3000");
});

// begin websocket
const websocket = require('ws').Server;

const wss = new websocket({server: server});

wss.on('connection',function connection(ws){
    const num = wss.clients.size;
    console.log("Connected clients: ",num);

    wss.broadcast(`Current user ${num}`);

    if(ws.readyState ===  ws.open){
        ws.send('Welcome to the chat room');
    }

    ws.on('close',function close(){
        wss.broadcast(`Current user ${num}`);
        console.log('disconnected');
        

    })

});

wss.broadcast= function broadcast(data){
    wss.clients.forEach(function each(client){
        client.send(data);
    });
}
