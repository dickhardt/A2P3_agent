/* 
* Copyright (C) Province of British Columbia, 2013
*/

(function() {
	'use strict';

	// ----------
	// Settings Model
	// Uses jStorage (HTML5 localStorage implementation
	// Quirk: The uuid for iOS is not unique for a device, 
	// but is unique per application per install. This will 
	// change if you delete the app and re-install, and possibly 
	// also when you upgrade your iOS version, or even upgrade 
	// your app per version (as we've seen in iOS 5.1). Not a reliable value.	
	// ----------

	window.Agent.Settings = Backbone.Model.extend({

		// Default attributes
		defaults: {
			DeviceId : '',
			Name: '',
			AuthenticationServerProtocol: '',
			AuthenticationServerHost: '',
			AuthenticationServerPort: '',
			RegistrarProtocol: '',
			RegistrarHost: '',
			RegistrarPort: '',
			SetupProtocol: '',
			SetupHost: '',
			SetupPort: '',
			DemoAppsURL: '',
			RegistrarToken: '',
			ResourceServerProtocol: '',
			ResourceServerPort: '',
			// Resource server we've authorized in the past and haven't revoked
			ResourceServerIds: null,
			NotificationDeviceToken: '',
			// Cache of previously see App Name
			// app id as key and 'name' element
			AppNameCache: null,
		},

		urlRoot: window.Agent.Context.BaseUrl + '/api/settings',
		
		// Singleton pattern checks if there is an existing configuration file
		initialize: function(resetto) {
			
			// check for localstorage
		 	if ($.jStorage.get('settings'))
			{
				// set defaults to what is found in localstorage
				this.set($.jStorage.get('settings'));
				console.log('Settings retrieved from storage = ' + JSON.stringify(this));
			}
			else
			{	    	
				// Populate default properties
				if (!window.device) {
					this.set({"Name": "My iPhone", 
    				"DeviceId": GUID()}); 	 
				}
				else {
					// Don't use device UUID
			      	this.set({"Name": device.name, 
    				"DeviceId": GUID()}); 	   
	        	}
	        	
	        	var authenticationServerHost;
	        	var authenticationServerPort;
	        	var registrarHost;
	        	var registrarPort;
	        	var setupHost;
	        	var setupPort;
	        	var resourceServerPort;
	        	
	        	switch (resetto) {
	        		case "local":
	        			authenticationServerHost = "as.local.a2p3.net";
	        			registrarHost = "registrar.local.a2p3.net";
	        			setupHost = "setup.local.a2p3.net";
	        			authenticationServerPort = "8080";
	        			registrarPort = "8080";
	        			setupPort = "8080";
	        			resourceServerPort = "8080";
	        			break;
	        		case "dev":
	        			authenticationServerHost = "as.dev.a2p3.net";
	        			registrarHost = "registrar.dev.a2p3.net";
	        			setupHost = "setup.dev.a2p3.net";
	        			break;
	        		case "prod":
	        		default:
	        			authenticationServerHost = "as.a2p3.net";
	        			registrarHost = "registrar.a2p3.net";
	        			setupHost = "setup.a2p3.net";
	        			break;
	        	}
	        	
	        	// Set bootstrap defaults here, could move this to somewhere more obvious
				this.set({"AuthenticationServerProtocol": "http",
					"AuthenticationServerHost": authenticationServerHost,
					"AuthenticationServerPort": authenticationServerPort,
					"RegistrarProtocol": "http",
					"RegistrarHost": registrarHost,
					"RegistrarPort": registrarPort,
					"SetupProtocol": "http",
					"SetupHost": setupHost,
					"SetupPort": setupPort,
					"DemoAppsURL": "http://www.a2p3.net/#demo",
					"RegistrarToken": "",
					"ResourceServerIds": null,
					"ResourceServerProtocol": "http",
					"ResourceServerPort": resourceServerPort,
					"NotificationDeviceToken": "",
					"AppNameCache": null});
	        	
	        	// store in localstorage
	        	this.save();
	        	console.log('First time settings initialized');
	        	console.log($.jStorage.get('settings'));
			}
		},
		
		/*
		 * Simple function to assemble the URL
		 */
		getAuthenticationServerURL: function () {
			var url = this.get("AuthenticationServerProtocol") + "://" + 
				this.get("AuthenticationServerHost");
			var port = this.get("AuthenticationServerPort");
			if (port &&
				port.length > 0) {
				url += ":" + port;	
			}
			return url;
		},
		
		/*
		 * Simple function to assemble the URL
		 */
		getRegistrarURL: function () {
			var url = this.get("RegistrarProtocol") + "://" + 
				this.get("RegistrarHost");
			var port = this.get("RegistrarPort");
			if (port &&
				port.length > 0) {
				url += ":" + port;	
			}
			return url;
		},
				/*
		 * Simple function to assemble the URL
		 */
		getSetupURL: function () {
			var url = this.get("SetupProtocol") + "://" + 
				this.get("SetupHost");
			var port = this.get("SetupPort");
			if (port &&
				port.length > 0) {
				url += ":" + port;	
			}
			return url;
		},
		/*
		 * Adds app name to our cache
		 * Overwrite any previous entries
		 * Not sure why associative arrays are having issues with jstorage 
		 */
		addAppName: function (appId, name) {
			//console.log("Adding app to cache id = " + appId + "; name = " + name);
			
			var appNameCache = this.get("AppNameCache");
			if (!appNameCache) {
				appNameCache = [];
			}
			
			// Blindly overwrite our cache
			var i;
			var found = false;
			for (i = 0; i < appNameCache.length; i++) {
				if (appNameCache[i].appId == appId) {
					appNameCache[i].name = name;
					found = true;
					break;
				}
			}
			if (!found) {
				appNameCache.push({"appId": appId, "name": name});
			}
			
			// All done, add it back and save
			this.set({"AppNameCache": appNameCache});
			this.save();
		},
		
		/*
		 * Gets an app name for a given app Id
		 */
		getAppName: function (appId) {
			// loop through
			var appNameCache = this.get("AppNameCache");
			if (appNameCache) {
				var i;
				for (i = 0; i < appNameCache.length; i++) {
					if (appNameCache[i].appId == appId) {
						return appNameCache[i].name;
					}
				}
			}
		},
		
		/* Adds resource ids to the resource array if it doesn't 
		 * already exist.
		 */
		addResourceIds: function (resourceIds) {
			
			// init
			var i
			var k;
			var found;
			var existingResourceIds = this.get("ResourceServerIds");
			if (!existingResourceIds) {
				existingResourceIds = [];
			}
			
			// For each given resource id find in our existing resource server ids
			for (i = 0; i < resourceIds.length; i++) {
				found = false;
				for (k = 0; k < existingResourceIds.length; k++) {
					if (existingResourceIds[k] == resourceIds[i]) {
						found = true;
						break;
					}
				}
				// Not found, add it
				if (!found) {
					existingResourceIds.push(resourceIds[i]);
				}
			}
			
			// All done, add it back and save
			this.set({"ResourceServerIds": existingResourceIds});
			this.save();
		},
	
		// Reset to factory settings
		reset: function (resetto) {
			$.jStorage.deleteKey('settings');
			$.jStorage.flush();
			this.initialize(resetto);
			this.trigger("change");
		},

		// Save to local stroage
		save: function () {
			$.jStorage.set('settings', this);
		},
		
		// Query enrollment state, if I have a registrar token then I am
		isEnrolled: function () {
			if (this.get("RegistrarToken")) {
				return true;
			}
			else {
				return false;
			}
		}
		
	});

})();