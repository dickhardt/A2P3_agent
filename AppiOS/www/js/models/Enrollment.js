/* 
* Copyright (C) Province of British Columbia, 2013
*/

(function() {
	'use strict';

	// ----------
	// Enrollment Model
	// ----------

	window.Agent.Enrollment = Backbone.Model.extend({
		
		urlRoot: window.Agent.Context.BaseUrl + '/api/Enrollment',

		// Default attributes
		defaults: {
			AuthenticationServerURL: '',
			//Passcode: '', should not need to persistent this in the model
			Name: '',
			DeviceId: '',
			Code: '',
			SourceUrl: '',
			Status: '',
			ErrorMessage: '',
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
			
			// Generate POST data
			var jsData1 = {"passcode": passcode,
				"name": this.get("Name"), 
				"code": this.get("Code"),
				"device": this.get("DeviceId")};

			// Convert to JSON
			var data1 = JSON.stringify(jsData1);

			// Get rid of passcode asap
			passcode = "";
			
			// Make URL
			var url1 = this.get("AuthenticationServerURL") + "/register/agent";
			
			console.log("Calling URL: " + url1);
			
			// Call AS 
			$.ajax({url: url1, 
				type: "POST",
				data: data1, 
				contentType: "application/json;", 
				dataType: "json",
				context: this,
				success: this.registerSuccess});
		},
		
		/*
		 * AJAX callback for register
		 */
		registerSuccess: function (data, textStatus, jqXHR) {
			console.log("Response data: " + JSON.stringify(data));
			
			if (textStatus == "success") {
				
				// Look for logical errors
				if (data.error) {
					// Update our status and set the message
					this.set({"Status": "Error", 
						"ErrorMessage": data.error.message});
					return;
				}
				
				// Save the token in settings
				settings.set({"RegistrarToken": data.result.token});	
				settings.save();
				
				// Update our status
				this.set({"Status": "Complete"});
				
				// Go home - TODO: models really shouldn't navigate... 
				app.home();
				
			} else {
				
				// Update our status
				this.set({"Status": "Failed"});
				
				UnhandledError(JSON.stringify(data));
			}
		},
	});

})();