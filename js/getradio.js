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
		
		if (!response.STATUS) response = response.RESPONSE;
		if (!response.STATUS) response = response[0]
		
		if (response.STATUS != "OK") {
			logError(response.ERROR);
			return;
		}
		
		console.log(JSON.stringify(response));
		
		playlist = []
		
		response.ALBUM.forEach(function(album) {
			console.log(JSON.stringify(album));
			
			album.TRACK.forEach(function(track) {
				console.log(JSON.stringify(track));
				
				playlist.push({
					artist: album.ARTIST[0].VALUE,
					album: album.TITLE[0].VALUE,
					title: track.TITLE[0].VALUE,
					id: track.GN_ID
				});
			});
		});
		
		listener(playlist);
	}
	
	var listener;
	
	return {		
		sendEvent: function(event_type, track_id) {
			$.ajax({
				type: 'GET',
				data: {
					client: credentials.clientIDfull,
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
		
		listen: function(f) {
			listener = f;
		},
		
		refresh: function() {
			requestUpdate();
		}
	};
}();