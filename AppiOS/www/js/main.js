/* 
* Copyright (C) Province of British Columbia, 2013
*/
$(document).ready(function () {
    console.log('main begin');
    // Init our singltons
	settings = new window.Agent.Settings();
	enrollmentSessions = new window.Agent.EnrollmentSessions();
	
	// Start up backbone
    app = new window.Agent.AppRouter();
    Backbone.history.start();
    
	console.log('main end');
});


