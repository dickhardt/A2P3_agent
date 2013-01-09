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
		
		register: function (passcode) {
			console.log("Begin register");
			// Set passcode
			this.set({"Passcode": passcode});
			
			// Call AS 
			
		}
		
	});

})();