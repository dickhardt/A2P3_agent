/* 
* Copyright (C) Province of British Columbia, 2013
*/

(function() {
	'use strict';

	// ----------
	// AgentRequest Model, A2P3 draft v8 compliant
	// ----------

	window.Agent.AgentRequest = Backbone.Model.extend({

		urlRoot: window.Agent.Context.BaseUrl + '/api/AgentRequest',

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
			
			// Request part of the source URL
			Request: '',
			
			// Notification URL Flag - Indicates if the client app wants a notification URL
			NotificationURLFlag: '', 
			
			// Notification URL - an optiona parameter for the Client to be notified
			NotificationURL: '', 
			
			// Name of the Client App - used for display purposes
			AppName: '',
			
			// An array of resource authZ URL as passed in from request
			Resources: null,
			
			// Array of resource server ids parsed from Resources
			ResourceIds: null,
						
			// An array of resource descriptions
			ResourceDescriptions: new Object(),
			
			// Indicates if the User must enter the passcode
			PasscodeFlag: true,
			
			// Passcode entered by user
			Passcode: '',
			
			// Indicates if the User must be prompted to authoze the txn
			AuthorizeFlag: true,
			
			// True or false if the user authorized this request
			Authorized: false,
			
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
			
			// Status of the request
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
			
			// Begin Async registrar and resource server calls
			this.verifyWithRegistrar();
			this.fetchResourceDescriptions();
			
		},
		
		/*
		 * Verifies the calling client app with registrar
		 * /app/verify
		 * NOTE: non-­-standard API, Agent does a POST call with the 
		 * “request” and 
		 * “token” parameters. 
		 * 
		 * Standard JSON response format. 
		 * 
		 * Called by: Personal Agent 
		 * 
		 * Purpose: checks if an Agent Request from an App is valid 
		 * 
		 * “request”: Agent Request received from App 
		 * “token”: agent token 
		 * 
		 */
		verifyWithRegistrar: function () {
			// make URL
			var url = settings.get("RegistrarURL") + "/request/verify";
			
			// make data
			var data = {"request": this.get("Request"),
				"token": settings.get("RegistrarToken")};
			
			// Call Registrar
			$.ajax({url: url, 
				type: "POST",
				data: JSON.stringify(data), 
				contentType: "application/json;", 
				dataType: "json",
				context: this,
				success: this.verifyWithRegistrarCallback});
		},
		
		/*
		 * Callback for verify with registrar
		 *  * “result”: 
		 * “name”: App name that was registered at the Registrar 
		 * 
		 * Error codes: 
		 * 
		 * “INVALID_APP_ID”: Unknown App ID in Agent Request. 
		 * “INVALID_REQUEST”: The Agent Request structure or signature is invalid. 
		 * "INVALID_TOKEN”: agent token is invalid
		 */
		verifyWithRegistrarCallback: function (data, textStatus, jqXHR) {
			console.log("registrar data=" + JSON.stringify(data));
			if (textStatus == "success") {
				if (data.result) {
					this.set("AppName", data.result.name);
				}
				else {
					this.set({"ErrorMessage": data.error.message,
						"Status": "AppVerifyFailed"});
				}
			}
			else {
				this.set({"ErrorMessage": textStatus,
					"Status": "AppVerifyFailed"});
			}
		},
		
		/*
		 * Get IX Token from AS
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
		startGetIXToken: function () {
			// Update status and reset error message
			this.set({"Status": "Processing",
				"ErrorMessage": ""});
			
			// Make JS POST data
			var jsData1 = {"device": this.get("DeviceId"),
				"sar": this.get("Sar"),
				"auth": {"passcode": this.get("Passcode"),
						 "authorization": this.get("Authorize")}};
			
			// Convert to JSON
			var data1 = JSON.stringify(jsData1);
			
			// Make URL
			var url1 = this.get("AuthenticationServerURL") + "/token";
			
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
			
			// success only means AS responsed
			if (textStatus == "success") {
				
				// Look for logical errors
				if (data.error) {
					this.set({"Passcode": "",
						"ErrorMessage": data.error.message});
					return;
				}
				
				// Get the IX Token out of response
				// update our model state
				this.set({"IXToken": data.result.token,
					"Status": "Complete"});
				
				// Save resource ids we've authorized
				settings.addResourceIds(this.get("ResourceIds"));
				
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
		 * Fetch resource descriptions from the resources
		 * named in the request.  These are all be done 
		 * async while we collect the user's passcode.
		 */
		fetchResourceDescriptions: function() {
			
			// Loop through each resource url
			var resourceUrls = this.get("Resources");
			var i = 0;
			for (i = 0; i < resourceUrls.length; i++) {
				// Call RS 			
				$.ajax({url: resourceUrls[i], 
					type: "GET", 
					dataType: "json",
					context: this,
					success: function (data, textStatus, jqXHR) {
						this.fetchResourceDescriptionCallback(data, textStatus, jqXHR, resourceUrls[i])}
					});			
			}
		},
		
		/* 
		 * Call back from each resource server, push into this resource description
		 * and allow the view to update
		 */
		fetchResourceDescriptionCallback:  function (data, textStatus, jqXHR, rsUrl) {
			console.log("data: " + JSON.stringify(data));
			
			// success only means RS responsed
			if (textStatus == "success") {
				// init
				var rsDescs = this.get("ResourceDescriptions");
				
				// add description, only EN supported for now.  TODO: make language a setting
				rsDescs[rsUrl] = data["en"];
				
				this.trigger("change");
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
		 * and we'll parse the resource ids while were at it
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
				this.set({"NotificationURLFlag" : notificationURL});
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
			
			// Parse each resource url for its id (aka hostname)
			var i;
			var resourceIds = [];
			for (i = 0; i < request.resources.length; i++) {
				// Parse URI
				var parsedUrl = parseUri(request.resources[i]);
				
				// Save hostname
				resourceIds[i] = parsedUrl.host;
				console.log("Resource id = " + resourceIds[i]);
			}
			
			
			// Populate my model
			this.set({"Sar": firstPart,
				"ReturnURL": request.returnURL,
				"Resources": request.resources,
				"ResourceIds": resourceIds,
				"PasscodeFlag": request.auth.passcode,
				"AuthorizeFlag": request.auth.authorization,
				"Request": requestParam});
		},
		
		/*
		 * Handles user cancellations
		 */
		cancel: function () {
			this.set({"Status": "Cancelled",
				"Error": "USER_CANCELLED",
				"ErrorMessage": "The User cancelled the transaction."});
			this.respondToClientApp();
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
