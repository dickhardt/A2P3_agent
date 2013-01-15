/* 
* Copyright (C) Province of British Columbia, 2013
*/

(function() {
	'use strict';

	// ----------
	// AgentRequest Model, A2P3 draft v8 compliant
	// ----------

	window.Agent.AgentRequest = Backbone.Model.extend({

		// Default attributes
		defaults: {
			// Raw incoming URL
			SourceUrl: '',
					
			// Where the Client App wants responses
			ReturnURL: '',
			
			// An array of resource authZ URL
			Resources: null,
			
			// Indicates if the User must enter the passcode
			PasscodeFlag: true,
			
			// Indicates if the User must be prompted to authoze the txn
			Authorize: true,
			
			// Indicates if the User must be prompted to use NFC enable card
			NFC: true,
			
			// State of the request
			Status: '',
			
			// Backbone state management
			IsSync: true,
		},
	
		initialize: function() {
			

		},
		
		/*
		 * Internal function to "crack" the request into Agent useful parts
		 * TODO: add error handling if request does not meet spec
		 * 
		 * TODO: example: a2p3.net://token?request=eyJ0eXAiOiJKV1MiLCJhbGciOiJIUzUxMiIsImtpZCI6InAxZjJfR3VfY2hER1lVd1AifQ.eyJpc3MiOiJhcHAuZXhhbXBsZS5jb20iLCJhdWQiOiJpeC5sb2NhbC5hMnAzLm5ldCIsInJlcWV1ZXN0LmEycDMub3JnIjp7InJldHVyblVSTCI6Imh0dHBzOi8vYXBwLmV4YW1wbGUuY29tL3JldHVyblVSTCIsInJlc291cmNlcyI6WyJodHRwczovL2hlYWx0aC5hMnAzLm5ldC9zY29wZS9wcm92X251bWJlciIsImh0dHBzOi8vcGVvcGxlLmEycDMubmV0L3Njb3BlL2RldGFpbHMiXSwiYXV0aCI6eyJwYXNzY29kZSI6dHJ1ZSwiYXV0aG9yaXphdGlvbiI6dHJ1ZX19LCJpYXQiOjEzNTU3ODY4NDB9.OcijfMJ_m_97nj-DQLX_VGoYXUyJaWzjzELoORiLSrRBC1WW8UCuFEC12dnflIEajj3AHUgGz9LRnBipeq0AlQ
		 * 
		 * split the Request on '.'
		 * the first part is the header, not much useful to you there
		 * the second part is the payload
		 * base 64 URL decode the payload
		 * JSON.parse the payload
		 * You now have the resources that you can fetch, and the returnURL for sending results back to the App\
		 */
		parseIncomingAgentRequest: function(url) {
			// Get the request portion
			var parsedUrl = parseUri(url);
			var requestParam = parsedUrl.queryKey.request;
			
			console.log("Request Param: " + requestParam);
			
			// Spilt in half
			var requestParamParts = requestParam.split(".");
			var secondPart = requestParamParts[1];
			
			console.log("Second part: " + secondPart);
			
			// Decode it to string
			var decodedSecondPart = atob(secondPart);
							
			console.log("Decoded: " + decodedSecondPart);
			
			// Parse into javascript
			var jsSecondPart = JSON.parse(decodedSecondPart);
			
			// Pull out request.a2p3.org part
			var request = jsSecondPart["request.a2p3.org"];
			
			// Populate my model
			this.set({"ReturnURL": request.returnURL,
				"Resources": request.resources,
				"PasscodeFlag": request.auth.passcode,
				"Authorize": request.auth.Authorize});
		}
	});

})();