var socketClient = function(config){
	var _this=this;
	this.socket;
	this.ready=false;
	this.io = require('socket.io-client');
	this.config=config || {};
	this.setConfig=function(config){
		_this.initialize(config);
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
			_this.socket.on(key,function(data,data2,data3){
				_this.config.events[key](data,data2,data3);
			});
		}
	}
	this.addEvent=function(message,callback){
		var channel = message.key || message.channel;
		if(typeof channel=="undefined")console.error("Please specify message or channel in thing");
		_this.config.events[message.key]=callback;
		_this.updateEvents();
	}
	this.sendMessage=function(message,callback){
		var channel = message.channel;
		if(typeof message.channel=="undefined")channel="message";
		_this.socket.emit(channel,message,callback);
	}
	this.initialize=function(config){
		var host = config.url || config.host+":"+config.port || "http://localhost:"+config.port
		
		_this.socket = _this.io.connect(host,{
			reconnect:true,
		});
		_this.socket.on('connect', function(){
			console.log("beginning to socket connect");
			var message={"auth":config.authorization,"fingerprint":config.fingerprint};
			if(_this.config.onConnect!="undefined"){
				message.onConnect=_this.config.onConnect;
			}
			_this.socket.emit("auth",message,function(res){
				if(!res.id){
					console.log("Couldn't authorize with socket, disconnecting",res);
					
				}
				else{
					console.log("Authorized as user: " + JSON.stringify(res));
					_this.config.socketConnect(res);
					_this.ready=true;
				}
			})
		});
		_this.socket.on('disconnect', function(){
			_this.config.socketDisconnect();
		});
	}
	this.exampleConfig={
		"port":5050,
		"events":{
			"message":function(res){
				console.log("Received this on message channel",res);
			}		
		},
		"socketConnect":function(res){
			console.log("Socket connected");
			/*setTimeout(function(){
				console.log("Sending a message to cats");
				_this.sendMessage({"channel":"cats","message":{"data":"key"}},function(res){
					console.log("Received this message back:");
					console.log(res);
				});
			},1000);*/
		},
		"socketDisconnect":function(res){
			console.log("Socket disconnect",res);
		}
	}
	function resolveAfterSeconds(seconds) { 
	  return new Promise(resolve => {
	    setTimeout(() => {
	      resolve();
	    }, seconds*1000);
	  });
	}
	this.awaitSocket = async function (){
		while(!_this.ready){
			console.log("Awaiting socket");
			await resolveAfterSeconds(1);
		}
	}
	if(typeof config!="undefined")this.setConfig(config);
}
module.exports = socketClient;
