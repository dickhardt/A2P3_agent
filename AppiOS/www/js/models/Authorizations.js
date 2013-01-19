/* 
* Copyright (C) Province of British Columbia, 2013
*/
(function() {
	'use strict';

	// ----------
	// Authorization Model
	// ----------

	window.Agent.Authorizations = Backbone.Model.extend({
		
		urlRoot: window.Agent.Context.BaseUrl + '/api/Authorizations',

		// Default attributes
		defaults: {
			RegistrarURL: '',
			ResourceServerIds: [],
			// “apps”: an array of the following object 
			// “app”: App ID “name”: Display name for App 
			// “lastAccess”: time of last access of App 
			// “resources”: array of authorized resource URLs 
			// “request”: an RS Request the agent can use to delete the authorization
			Apps: [],
			ErrorMessage: '',
			IsSync: true,
		},
	
		initialize: function() {
			
			// get resource server ids from config
			var resourceServerIds = settings.get("ResourceServerIds");
			var registrarUrl = settings.get("RegistrarURL");
			this.set({"ResourceServerIds": resourceServerIds,
				"RegistrarURL": registrarUrl});
			
			// if we have any authZ start the process
			if (resourceServerIds && 
				resourceServerIds.length > 0) {
				this.getResourceServerTokens();
			}
		},
		
		/*
		 * Calls registrar to get all the resource server tokens. 
		 */
		getResourceServerTokens: function () {
			// Get registrar URL
			
		}
	});

})();