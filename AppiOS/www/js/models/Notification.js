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
			pushNotification.registerDevice({alert:true, badge:false, sound:true}, function(status) {
			    console.log(JSON.stringify(['registerDevice status: ', status])+"\n");
			    settings.set("NotificationDeviceToken", status.deviceToken);
			    settings.save();
			});
			
			// And test if registration is scuessful
			pushNotification.getRemoteNotificationStatus(function(status) {
			    console.log(JSON.stringify(['Registration check - getRemoteNotificationStatus', status])+"\n");
			});
		},
		
		/*
		 * Event for getting notification while we launch
		 * 
		 * We could have a pile up of notifications
		 * use only the most recent
		 */
		getPendingNotifications: function () {
			// First get them
			var pushNotification = window.plugins.pushNotification;
			var notifcations = pushNotification.getPendingNotifications();
			
			// Grab last one and process
		},
		
		/*
		 * Logic for processing the AN incoming notification
		 *
		 */
		onPendingNotification: function (notification) {
			
		},
		
		/*
		 * // Event spawned when a notification is received while the application is active
	PushNotification.prototype.notificationCallback = function(notification) {
		var ev = document.createEvent('HTMLEvents');
		ev.notification = notification;
		ev.initEvent('push-notification', true, true, arguments);
		document.dispatchEvent(ev);
	};
		 */
	});

})();  