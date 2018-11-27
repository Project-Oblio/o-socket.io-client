# o-socket.io-client
Initialize a socket.io client with a simple json structure

## example
```

<html>
<script src="./socketClient.min.js"></script>
<h1>Hi</h1>
<script>
var socketClient = new SocketClient({
	"port":5050,
	"events":{
		"message":function(res){
			console.log("Received this on message channel",res);
		},
		"cats":function(res){
			console.log("Received this on cats channel",res);
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
});
</script>
</html>

```

