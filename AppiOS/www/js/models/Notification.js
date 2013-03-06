/* 
* Copyright (C) 2013 Sierra Systems Group Inc.
*
* Permission is hereby granted, free of charge, to any person obtaining a 
* copy of this software and associated documentation files (the "Software"), 
* to deal in the Software without restriction, including without limitation 
* the rights to use, copy, modify, merge, publish, distribute, sublicense, 
* and/or sell copies of the Software, and to permit persons to whom the 
* Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included 
* in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS 
* OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL 
* THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
* DEALINGS IN THE SOFTWARE.
*
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
	window.Agent.Notification.processPendingNotifications = function () {
		console.log("processing pending notifications");
		// First get them
		var pushNotification = window.plugins.pushNotification;
		if (pushNotification) {
        	pushNotification.getPendingNotifications(function (notifications) {
        			window.Agent.Notification.getPendingNotificationsCallback(notifications);
        		});
       	}
	}
	
	window.Agent.Notification.getPendingNotificationsCallback = function (data) {
		console.log("notifications = " + JSON.stringify(data)); 
		
        if (data.notifications &&
            data.notifications.length > 0) {
                                                  
            // Grab last one and process
            var notification = data.notifications[data.notifications.length - 1];
		
		    // Call event
		    window.Agent.Notification.onPendingNotification(notification);
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
	window.Agent.Notification.onPendingNotification = function (notification) {
		
		console.log("notify = ", notification);

		// use the home view processing this URL
		if (notification.url) {
			app.home(notification.url);
		}
		else {
			UnhandledError("Expected url in notification not found for notfication: " + notiJson);
		}
	}
	
	window.Agent.Notification.onPendingNotificationWhileActive = function (ev) {
		window.Agent.Notification.onPendingNotification(ev.notification);
	}

})();  