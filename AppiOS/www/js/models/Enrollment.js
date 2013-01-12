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
			//Passcode: '', should not need to persistent this in the model
			Name: '',
			DeviceId: '',
			Code: '',
			SourceUrl: '',
			Status: '',
			IsSync: true,
		},
	
		initialize: function() {
			
			// Parse the source url for the Code
			var parsedUrl = parseUri(this.get("SourceUrl"));
			var enrollmentCode = parsedUrl.queryKey.code;
			
			// Get AS URL, name and deviceId from config
			this.set({"AuthenticationServerURL": settings.get("AuthenticationServerURL"), 
				"Name": settings.get("Name"),
				"DeviceId": settings.get("DeviceId"),
				"Code": enrollmentCode,});
		},
		
		
		/*
		 * Makes AJAX POST to AS server
		 */
		register: function (passcode) {
			
			console.log("Begin register");
			
			// Update our status
			this.set({"Status": "Inprogress"});
			
			// Generate POST data string
			var data1 = "passcode=" + encodeURI(passcode) +
				"&name=" + encodeURI(this.get("Name")) + 
				"&code=" + encodeURI(this.get("Code")) +
				"&device=" + encodeURI(this.get("DeviceId"));

			// Get rid of passcode asap
			passcode = "";
			
			// Make URL
			var url1 = this.get("AuthenticationServerURL") + "/register/agent";
			
			console.log("Calling URL: " + url1);
			
			// Call AS 
			$.post(url1, data1, this.registerSuccess);
			
		},
		
		/*
		 * AJAX callback for register
		 */
		registerSuccess: function (data, textStatus, jqXHR) {
			
			if (textStatus == "success") {
				
				// Save the token in settings
				settings.set({"RegistrarToken": data.result.token});	
				settings.save();
				
				// Update our status
				this.set({"Status": "Complete"});
				
			} else {
				
				// Update our status
				this.set({"Status": "Failed"});
			}
		},
	});

})();