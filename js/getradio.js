const radio = function() {
	const domain = "https://sonorita.herokuapp.com/";
	
	return {
		send_pulse: function(pulseDelta) {
			$.ajax({
				type: 'POST',
				data: {
					pulseDelta: pulseDelta
				},
				url: domain + "pulse",
				dataType: 'json'
			});
			
			console.log("pulse sent");
		},
		
		send_action: function(action) {
			$.ajax({
				type: 'POST',
				data: {
					action: action
				},
				url: domain + "action",
				dataType: 'json'
			});
			
			console.log("action sent");
		},
		
		get_playlist: function() {
			$.ajax({
				type: 'GET',
				url: domain + "playlist",
				dataType: 'json',
				success: function(response) {
					console.log("playlist received");
					
					//TODO
				}
			});
			
			console.log("playlist requested");
		}
	};
}();