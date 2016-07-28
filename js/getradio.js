const radio = function() {
	const domain = "https://" + credentials.clientID + ".web.cddbp.net/webapi/json/1.0/";
		
	var playlist = []
	
	function logError(err) {
		console.log("=(")
		console.log(JSON.stringify(err));
	}
	
	function requestUpdate() {
		$.ajax({
			type: 'GET',
			url: domain + "radio/lookahead",
			data: {
				client: credentials.clientIDfull,
				user: credentials.userID,
				radio_id: credentials.radioID
			},
			dataType: 'json',
			success: receiveUpdate,
			error: logError
		});
		
		console.log("playlist requested");
	}
	
	function receiveUpdate(response) {
		console.log("Response received");
		console.log(JSON.stringify(response));
	}
	
	return {		
		sendEvent: function(event_type, track_id) {
			$.ajax({
				type: 'GET',
				data: {
					client: credentials.clientID,
					user: credentials.userID,
					radio_id: credentials.radioID,
					event: event_type + "_" + track_id
				},
				url: domain + "event",
				dataType: 'json',
				success: receiveUpdate,
				error: logError
			});
			
			console.log("action sent");
		},
		
		nextTrack: function() {
			if (playlist.length == 0) requestUpdate();
			
			return playlist.splice(0,1);
		}
	};
}();