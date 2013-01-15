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
			// AS URL
			AuthenticationServerURL: '',
			
			// Device Id
			DeviceId: '',
			
			// Raw incoming URL
			SourceUrl: '',
					
			// Where the Client App wants responses
			ReturnURL: '',
			
			// State - an optional parameter for the Client APp to preserve state
			State: '',
			
			// Sar - signature of the agent request
			Sar: '',
			
			// Notification URL - an optiona parameter for the Client to be notified
			NotificationURL: '', 
			
			// An array of resource authZ URL
			Resources: null,
			
			// Indicates if the User must enter the passcode
			PasscodeFlag: true,
			
			// Indicates if the User must be prompted to authoze the txn
			Authorize: true,
			
			// Indicates if the User must be prompted to use NFC enable card
			// Unsupported in this Agent
			NFC: true,
			
			// The IX Token returned from the AS after successful authN
			IXToken: '',
			
			// “USER_CANCELLED”: The User cancelled the transaction. 
			// “INVALID_APP_ID”: Registrar did not recognize the App ID. 
			// “INVALID_REQUEST”: The Request structure or signature is invalid. 
			// “INVALID_RETURN_URL”: The ReturnURL is not registered for this App ID with the Registrar.
			ErrorCode: '',
			
			// Error Message - a natural language description of the error
			ErrorMessage: '',
			
			// State of the request
			Status: '',
			
			// Backbone state management
			IsSync: true,
		},
	
		initialize: function() {
			// Get AS URL and deviceId from config
			this.set({"AuthenticationServerURL": settings.get("AuthenticationServerURL"), 
				"DeviceId": settings.get("DeviceId"),});
			
			// parse URL
			this.setAgentRequest(this.get("SourceUrl"));
			
		},
		
		/*
		 * Logon, user provides passcode
		 *  we authN with the AS that inclues part of the inbound request
		 * AS URL/token
		 * Call method: POST of JSON object
		 * 	{ “device”: device id
		 * 	, “sar”: signature of Agent Request
		 * , “auth”:{ “passcode”: passcode if entered by User
		 * 	, “authorization”: User AuthZ flag
		 * , “nfc”: flag indicating if NFC was used
		 * }}
		 * “result”: 
		 * “token”: IX Token if successful
		 * Error codes:
		 * “INVALID_DEVICEID”: Invalid device ID
		 */
		getIXToken: function (passcode) {
			// Update status
			this.set({"Status": "GettingIXToken"});
			
			// Make JS POST data
			var jsData1 = {"device": this.get("DeviceId"),
				"sar": this.get("Sar"),
				"auth": {"passcode": passcode,
						 "authorization": this.get("Authorize")}};
			
			// Convert to JSON
			var data1 = JSON.stringify(jsData1);
			console.log("Post data: " + data1);
			
			// Make URL
			var url1 = this.get("AuthenticationServerURL") + "/token";
			console.log("Calling URL: " + url1);
			
			// Call AS 
			$.ajax({url: url1, 
				type: "POST",
				data: data1, 
				contentType: "application/json;", 
				dataType: "json",
				context: this,
				success: this.getIXTokenCallback});
		},
		
		/*
		 * Callback for getIXToken
		 */
		getIXTokenCallback: function (data, textStatus, jqXHR) {
			console.log("IXToken call back start");
			console.log("data: " + JSON.stringify(data));
			
			// success only means AS responsed
			if (textStatus == "success") {
				
				// Look for logical errors
				if (data.error) {
					//TODO: passcode err handling
					UnhandledError(JSON.stringify(data.error));
					this.set({"Status": "GetPasscode"});
					return;
				}
				
				// Get the IX Token out of response
				// update our model state
				this.set({"IXToken": data.result.token,
					"Status": "GotIXToken"});
				
				// Now respond to the Client App
				this.respondToClientApp();
				
				return;
			}
			else {
				//TODO: err handling
				UnhandledError(JSON.stringify(data));
			}
			
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
		setAgentRequest: function(url) {
			// Get the request portion
			var parsedUrl = parseUri(url);
			
			// Requireds'
			var requestParam = parsedUrl.queryKey.request;
			
			// Optionals'
			if (parsedUrl.queryKey.state) {
				var state = parsedUrl.queryKey.state;
				this.set({"State" : state});
			}
			if (parsedUrl.queryKey.notificationURL) {
				var notificationURL = parsedUrl.queryKey.notificationURL;
				this.set({"NotificationURL" : notificationURL});
			}
			
			console.log("Request Param: " + requestParam);
			
			// Spilt in half
			var requestParamParts = requestParam.split(".");
			var firstPart = requestParamParts[0]; // the SAR part
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
			this.set({"Sar": firstPart,
				"ReturnURL": request.returnURL,
				"Resources": request.resources,
				"PasscodeFlag": request.auth.passcode,
				"Authorize": request.auth.Authorize});
		},
		
		/*
		 * Call back the Client App using their returnUrl with appended query parameters
		 * Returns: “token”: IX Token if successful, 
		 * “notificationURL”: if requested, supported and authorized 
		 * “state”: the state parameter if provided by the App 
		 * “error”: the error code if a request was not successful 
		 * “errorMessage”: a message about the error
		 */
		respondToClientApp: function () {
			
			// Make required parts of the response URL
			var url1 = this.get("ReturnURL") + 
				"?token=" + encodeURI(this.get("IXToken"));
			
			// Make optional part NotificationURL
			var notificationURL = this.get("NotificationURL");
			if (notificationURL) {
				url1 += "&notificationURL=" + encodeURI(notificationURL);
			}
			
			// Make optional part state
			var state = this.get("State");
			if (state) {
				url1 += "&state=" + state; // This does not need encoding since it was read verbatium from request URL
			}
			
			// Make optional part error
			var error = this.get("Error");
			if (error) {
				url1 += "&error=" + encodeURI(error);
			}
			
			// Make optional part errorMessage
			var errorMessage = this.get("ErrorMessage");
			if (errorMessage) {
				url1 += "&errorMessage=" + encodeURI(errorMessage);
			}
			
			console.log("Client App response URL: " + url1);
			
			window.location.href = url1;
			
		}
	});

})();