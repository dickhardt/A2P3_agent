/* 
* Copyright (C) Province of British Columbia, 2013
*/

$(function($) {
	'use strict';
	
	window.Agent.SettingsView = Backbone.View.extend({
	
	    template:_.template($('#settings').html()),
	
		initialize: function(Opts) {
					},
		
	    render:function (eventName) {
	    	console.log(this.model);
	       	this.$el.html(this.template(this.model.toJSON()));
	        
	        return this;
	    },
	
		events: {
			"click a[id=save]": "save",
			"click a[id=reset]": "reset",
			"click a[id=cancel]": "cancel",
			"click a[id=confirm]": "confirm",
		},
		
		cancel: function () {
			this.$("#resetDialogue").popup("close");
		},
		
		reset: function () {
			this.$("#resetDialogue").popup("open", 
				{transition: "pop",
				 shadow: true});
		},
		
		confirm: function() {

			console.log("Resetting");
		
		   // Reset model
		   this.model.reset();
		   
		   // Redo notificaitons
		   notification.register();
		   
		   // Route back to this page
		   app.settings();
		},
		
		/*
		 * Save the model and go back home
		 */
		save: function () {
			this.model.set({"Name" : $("#name").val(), 
				"DeviceId" : $("#id").val(),
				"AuthenticationServerURL" : $("#authenticationServerURL").val(),
				"RegistrarURL": $("#registrarURL").val(),
				"SetupUrl": $("#setupUrl").val(),
				"DemoAppsURL" : $("#demoAppsURL").val(),
				"RegistrarToken" : $("#registrarToken").val(),
				"ResourceServerProtocol": $("#resourceServerProtocol").val(),
				"ResourceServerPort": $("#resourceServerPort").val(),
				"NotificationDeviceToken": $("#notificationDeviceToken").val(),
				})
			this.model.save();
			app.navigate("", true);
		},
	    
	});
});