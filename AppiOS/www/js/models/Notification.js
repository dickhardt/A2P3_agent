/* 
* Copyright (C) Province of British Columbia, 2013
*/

(function() {
	//'use strict';

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
		
	});
	
	/*
	 * Method for getting notification while we launch
	 * 
	 * We could have a pile up of notifications
	 * use only the most recent
	 */
	window.Agent.Notification.processPendingNotifications = function (onDefaultEvent) {
		console.log("processing pending notifications");
		// First get them
		var pushNotification = window.plugins.pushNotification;
		if (pushNotification) {
        	pushNotification.getPendingNotifications(function (notifications) {
        			window.Agent.Notification.getPendingNotificationsCallback(notifications, onDefaultEvent);
        		});
       	}
       	else {
       		onDefaultEvent();
       	}
	}
	
	window.Agent.Notification.getPendingNotificationsCallback = function (data, onDefaultEvent) {
		console.log("notifications = " + JSON.stringify(data)); 
		
        if (data.notifications &&
            data.notifications.length > 0) {
                                                  
            // Grab last one and process
            var notification = data.notifications[data.notifications.length - 1];
		
		    // Call event
		    window.Agent.Notification.onPendingNotification(notification, onDefaultEvent);
        }
        else {
        	onDefaultEvent();
        }
	}
		
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
	window.Agent.Notification.onPendingNotification = function (notification, onDefaultEvent) {
		
		console.log("notify = ", notification);

		// use the home view processing this URL
		if (notification.url) {
			app.homeFollow(notification.url);
		}
		else {
			onDefaultEvent();
			UnhandledError("Expected url in notification not found for notfication: " + notiJson);
		}
	}
	
	window.Agent.Notification.onPendingNotificationWhileActive = function (ev) {
		window.Agent.Notification.onPendingNotification(ev.notification);
	}

})();  