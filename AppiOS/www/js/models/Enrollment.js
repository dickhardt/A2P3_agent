/* 
* Copyright (C) Province of British Columbia, 2013
*/

(function() {
	'use strict';

	// ----------
	// Enrollment Model
	// ----------

	window.Agent.Enrollment = Backbone.Model.extend({

		// Default attributes
		defaults: {
			AuthenticationServerURL: '',
			Passcode: '',
			Name: '',
			DeviceId: '',
			Code: '',
			SourceUrl: '',
			IsSync: true,
		},
	
		initialize: function() {
			
			// Parse the source url for the Code
			var parsedUrl = parseUri(this.get("SourceUrl"));
			var enrollmentCode = parsedUrl.queryKey.code;
			
			// Get AS URL, name and deviceId from config
			this.set({"AuthenticationServerURL": settings.AuthenticationServerURL, 
				"Name": settings.Name,
				"DeviceId": settings.DeviceId,
				"Code": enrollmentCode,});
		},
		
		
		/*
		 * Makes AJAX POST to AS server
		 */
		register: function (passcode) {
			console.log("Begin register");
			
			// Generate POST data string
			var data = "passcode=" + encodeURI(passcode) +
				"&name=" + encodeURI(this.get("Name")) + 
				"&code=" + encodeURI(this.get("Code")) +
				"&device=" + encodeURI(this.get("DeviceId"));

			// Get rid of passcode asap
			passcode = "";
			
			// Call AS 
			$.ajax({
			  type: "POST",
			  url: settings.get("AuthenticationServerURL") + "/register/agent",
			  data: data,
			  success: this.registerSuccess
			});
			
		},
		
		/*
		 * AJAX callback for register
		 */
		registerSuccess: function (data, textStatus, jqXHR) {
			
			if (textStatus == "success") {
				console.log(data);
			}
		},
	});

})();