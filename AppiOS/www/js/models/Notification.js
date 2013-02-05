/* 
* Copyright (C) Province of British Columbia, 2013
*/
(function() {
	'use strict';

	// ----------
	// Notification Model
	// ----------

	window.Agent.Notification = Backbone.Model.extend({
		
		urlRoot: window.Agent.Context.BaseUrl + '/api/Notification',

		// Default attributes
		defaults: {
			ErrorMessage: '',
			IsSync: true,
		},
	
		initialize: function() {
			
		},
		
		/*
		 * Registers the device with Apple Push Notification Service (APN)
		 */
		register: function () {
			// Register device for push notifications
			var pushNotification = window.plugins.pushNotification;
			if (pushNotification) {
				pushNotification.registerDevice({alert:true, badge:false, sound:true}, function(status) {
				    console.log(JSON.stringify(['registerDevice status: ', status])+"\n");
				    settings.set("NotificationDeviceToken", status.deviceToken);
				    settings.save();
				});
				
				// And test if registration is scuessful
				pushNotification.getRemoteNotificationStatus(function(status) {
				    console.log(JSON.stringify(['Registration check - getRemoteNotificationStatus', status])+"\n");
				});
			}
		},
		
		/*
		 * Method for getting notification while we launch
		 * 
		 * We could have a pile up of notifications
		 * use only the most recent
		 */
		processPendingNotifications: function () {
			console.log("processing pending notifications");
			// First get them
			var pushNotification = window.plugins.pushNotification;
			
			if ("pushNotification = " + JSON.stringif(pushNotification));
			
			pushNotification.getPendingNotifications(getPendingNotificationsCallback);
			
			
		},
		
		getPendingNotificationsCallback: function (notifications) {
			console.log("notifications = " + JSON.stringify(notifications));
			
			// Grab last one and process
			var notification = notifications[notifications.length - 1];
			
			// Call event
			this.onPendingNotification(notification);
		},
		
		/*
		 * Logic for processing the AN incoming notification
		 * 
		 * Sample payload 
		 * {
		 *   "aps" : {
		 *       "alert" : “<insert app name> is requesting logon”,
		 *       "sound" : "chime"
		 *   },
		 *   "url" : "<insert app small url>"
		 *	}
		 */
		onPendingNotification: function (notification) {
			
			console.log("notification = " + JSON.stringify(notification));
			
			// use the home view processing this URL
			if (notification.url) {
				app.home(notification.url);
			}
			else {
				UnhandledError("Expected url in notification not found for notfication: " + notification);
			}
		},
	});

})();  