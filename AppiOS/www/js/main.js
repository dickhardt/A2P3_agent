/* 
* Copyright (C) Province of British Columbia, 2013
*/
$(document).ready(function () {  
    // Init our singltons
	settings = new window.Agent.Settings();
	enrollmentSessions = new window.Agent.EnrollmentSessions();
	agentRequestSessions = new window.Agent.AgentRequestSessions();
	
	// Start up backbone
    app = new window.Agent.AppRouter();
    Backbone.history.start();
    
    
    
});

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    // Register device for push notifications
	var pushNotification = window.plugins.pushNotification;
	pushNotification.registerDevice({alert:true, badge:true, sound:true}, function(status) {
	    console.log(JSON.stringify(['registerDevice status: ', status])+"\n");
	    //app.storeToken(status.deviceToken);
	});
	
	// And test if registration is scuessful
	pushNotification.getRemoteNotificationStatus(function(status) {
	    console.log(JSON.stringify(['Registration check - getRemoteNotificationStatus', status])+"\n");
	});
}
