/* 
* Copyright (C) Province of British Columbia, 2013
*/

window.Agent = window.Agent || {};

(function() {
	'use strict';

	// ----------
	// Enrollment Sessions hold is a non-persistent store for our
	// enrollment models.
	// ----------

	window.Agent.EnrollmentSessions = Backbone.Collection.extend({
		
		model: window.Agent.Enrollment,
		
		initialize: function() {
			
		},
	    
	    url: function() {
	    	return window.Agent.Context.BaseUrl + "/api/EnrollmentS";
	    },
	       
	});

})();	