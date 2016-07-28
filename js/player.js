const music_player = function() {
	
	var currentTrack = null;
	
	var SAAgent = null;
	var SASocket = null;
	var CHANNELID = 424215;

	function onerror(err) {
		console.log("err [" + err + "]");
	}

	const agentCallback = {
		onconnect : function(socket) {
			SASocket = socket;
			createHTML("HelloAccessory Connection established with RemotePeer");
			SASocket.setSocketStatusListener(function(reason){
				console.log("Service connection lost, Reason : [" + reason + "]");
				disconnect();
			});
			SASocket.setDataReceiveListener(onreceive);
		},
		onerror : onerror
	};

	const peerAgentFindCallback = {
		onpeeragentfound : function(peerAgent) {
			try {
				SAAgent.setServiceConnectionListener(agentCallback);
				SAAgent.requestServiceConnection(peerAgent);

			} catch(err) {
				console.log("exception [" + err.name + "] msg[" + err.message + "]");
			}
		},
		onerror : onerror
	}

	function onsuccess(agents) {
		try {
			if (agents.length > 0) {
				SAAgent = agents[0];

				SAAgent.setPeerAgentFindListener(peerAgentFindCallback);
				SAAgent.findPeerAgents();
			} else {
				createHTML("Not found SAAgent!!");
			}
		} catch(err) {
			console.log("exception [" + err.name + "] msg[" + err.message + "]");
		}
	}

	function onreceive(channelId, data) {
		console.log(JSON.stringify(data));
		
		listener(data.event_type, data.nowPlaying);
	}
	
	var listener;
	
	return {
		connect: function() {
			if (SASocket) {
		        return false;
		    }
			try {
				webapis.sa.requestSAAgent(onsuccess, function (err) {
					console.log("err [" + err.name + "] msg[" + err.message + "]");
				});
			} catch(err) {
				console.log("exception [" + err.name + "] msg[" + err.message + "]");
			}
		},

		disconnect: function() {
			try {
				if (SASocket != null) {
					SASocket.close();
					SASocket = null;
				}
			} catch(err) {
				console.log("exception [" + err.name + "] msg[" + err.message + "]");
			}
		},
		
		sendRequest: function(request_type, playlist) {
			try {
				SASocket.sendData(CHANNELID, "Hello Accessory!");
			} catch(err) {
				console.log("exception [" + err.name + "] msg[" + err.message + "]");
			}
		},
		
		listen: function(f) {
			listener = f;
		},
	}
}();