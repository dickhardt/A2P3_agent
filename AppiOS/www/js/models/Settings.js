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
			AuthenticationServerURL: '',
			DemoAppsURL: '',
			RegistrarToken: '',
		},

		urlRoot: window.Agent.Context.BaseUrl + '/api/settings',
		
		// Singleton pattern checks if there is an existing configuration file
		initialize: function() {
			
			// check for localstorage
		 	if ($.jStorage.get('settings'))
			{
				// set defaults to what is found in localstorage
				this.set($.jStorage.get('settings'));
				console.log('Settings retrieved from storage');
			}
			else
			{	    	
				// Populate default properties
				if (!window.device) {
					this.set({"Name": "Dev Device Name", 
    				"DeviceId": GUID()}); 	 
				}
				else {
			      	this.set({"Name": device.name, 
    				"DeviceId": window.device.uuid}); 	   
	        	}
	        	
	        	// Set bootstrap defaults here, could move this to somewhere more obvious
				this.set({"AuthenticationServerURL": "https://as.a2p3.net/",
					"DemoAppsURL": "https://a2p3.ca/#demo"});
	        	
	        	// store empty session in localstorage
	        	$.jStorage.set('settings', this);
	        	console.log('First time settings initialized');
	        	console.log($.jStorage.get('settings'));
			}
		},
	
		// Reset to factory settings
		reset: function () {
			$.jStorage.deleteKey('settings');
			this.initialize();
		},

		sync: function(method, model, options) {
			if (method === 'create') {
				return $.ajax(options);
			}
			else {
				Backbone.sync(method, model, options);
			}
			
		},
	});

})();