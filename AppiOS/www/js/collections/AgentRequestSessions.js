/* 
* Copyright (C) Province of British Columbia, 2013
*/

window.Agent = window.Agent || {};

(function() {
	'use strict';

	// ----------
	// Agent Request Sessions hold is a non-persistent store for our
	// agent request models.
	// ----------

	window.Agent.AgentRequestSessions = Backbone.Collection.extend({
		
		model: window.Agent.AgentRequest,
		
		initialize: function() {
			
		},
	    
	    url: function() {
	    	return window.Agent.Context.BaseUrl + "/api/EnrollmentS";
	    },
	       
	});

})();	