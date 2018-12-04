var socketClient = function(config){
	var host = config.url || config.host+":"+config.port || "http://localhost:"+config.port
	console.log(host);
	var io = require('socket.io-client');
	var socket = io.connect(host,{
		reconnect:true,
	});
	var _this=this;
	this.config=config || {};
	socket.on('connect', function(){
		socket.emit("auth",{"auth":config.authorization},function(res){
			console.log("Recieved this res",res);
			if(!res.username && !res.id){
				console.log("Couldn't authorize with socket");
			}
			else{
				console.log("Authorized as user: " + JSON.stringify(res));
				_this.config.socketConnect(res);
			}
		})
	});
	
	socket.on('disconnect', function(){
		_this.config.socketDisconnect();
	});

	
	this.socket=socket;
	this.sendMessage=function(message,callback){
		var channel = message.channel || channel;
		_this.socket.emit(channel,message,callback);
	}
	this.setConfig=function(config){
		for(var key in config){
			if(typeof config[key]==='object'){
				if(typeof _this.config[key]=="undefined")_this.config[key]=config[key];
				else{
					for(var key2 in config[key]){
						_this.config[key][key2]=config[key][key2]
					}
				}
			}else{
				_this.config[key]=config[key]
			}
		}
		_this.updateEvents();
	}

	this.updateEvents=function(){
		for(var key in _this.config.events){
			socket.on(key,function(data,data2,data3){
				_this.config.events[key](data,data2,data3);
			});
		}
	}

	this.setConfig(config);

	this.exampleConfig={
		"port":5050,
		"events":{
			"message":function(res){
				console.log("Received this on message channel",res);
			}		
		},
		"socketConnect":function(res){
			console.log("Socket connected");
			setTimeout(function(){
				console.log("Sending a message to cats");
				socketClient.sendMessage({"channel":"cats","message":{"data":"key"}},function(res){
					console.log("Received this message back:");
					console.log(res);
				});
			},1000);
		},
		"socketDisconnect":function(res){
			console.log("Socket disconnect",res);
		}
	}
}
module.exports = socketClient;
