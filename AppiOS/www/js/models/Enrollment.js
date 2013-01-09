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
			Id: '',
			authenticationServerURL: '',
			passcode: '',
			name: '',
			deviceId: '',
			isSync: true,
		},
		
		urlRoot: window.Agent.Context.BaseUrl + '/enroll',
		
		// set id to API identifier which has capital I
		idAttribute: 'Id',
		
		initialize: function() {
			// Get AS URL, name and deviceId from config
			
		},

		sync: function(method, model, options) {
			if (method === 'create') {
				return $.ajax(options);
			}
			else {
				Backbone.sync(method, model, options);
			}
			
		},
		
		// Registers the Agent with the Authentication Server
		// API: https://github.com/dickhardt/A2P3/tree/master/app/as
		registerAgent: function () {
			// use $.ajax
		}
		
		
	});

})();