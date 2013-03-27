/* 
* Copyright (C) Province of British Columbia, 2013
*/

$(function($) {
	'use strict';
	
	window.Agent.DevView = Backbone.View.extend({
	
	    template:_.template($('#dev').html()),
	
		initialize: function(Opts) {
			this.model.on("change", this.render, this);
		},
		
	    render:function (eventName) {
	       	this.$el.html(this.template(this.model.toJSON()));
	        
	        // Select our drop down lists
	    	this.$("#authenticationServerProtocolList").val(this.model.get("AuthenticationServerProtocol"));
	    	this.$("#authenticationServerHostList").val(this.model.get("AuthenticationServerHost"));
	    	this.$("#registrarProtocolList").val(this.model.get("RegistrarProtocol"));
	   		this.$("#registrarHostList").val(this.model.get("RegistrarHost"));
	    	this.$("#resourceServerProtocolList").val(this.model.get("ResourceServerProtocol"));
	    	this.$("#setupProtocolList").val(this.model.get("SetupProtocol"));
	    	this.$("#setupHostList").val(this.model.get("SetupHost"));
	    	
	    	// force jquery to restyle
	    	$(this.el).trigger("pagecreate");
	    	
	        return this;
	    },
	
		events: {
			"click a[id=reset]": "reset",
			"click a[id=cancel]": "cancel",
			"click a[id=confirm]": "confirm",
			"click a[id=back]": "back",
			"change input": "save",
			"change select": "save",
			"popupbeforeposition div[id=resetDialogue]": "stopTouchOutOfPop"
		},
		
		stopTouchOutOfPop: function () {
        	$('.ui-popup-screen').off();
       	},
		
		back: function () {
			app.settings(true);
		},
		
		cancel: function () {
			this.$("#resetDialogue").popup("close");
		},
		
		reset: function () {
			this.$("#resetDialogue").popup("open", 
				{transition: "pop",
				 shadow: true});
		},
		
		confirm: function(ev) {
			var resetto = $(ev.currentTarget).data('resetto');
			
			console.log("Resetting to " + resetto);
			
		   // Reset model
		   this.model.reset(resetto);
		   
		   // Redo notificaitons
		   notification.register();
		  
		   // go home
		   app.navigate("#home", true);
		}, 

		
		/*
		 * Save the model and go back home
		 */
		save: function () {
			var savedScrollTop = $(document).scrollTop();
			this.model.set({"Name" : $("#name").val(), 
				"DeviceId" : $("#id").val(),
				"AuthenticationServerProtocol": $("#authenticationServerProtocolList").val(),
				"AuthenticationServerHost": $("#authenticationServerHostList").val(),
				"AuthenticationServerPort": $("#authenticationServerPort").val(),
				"RegistrarProtocol": $("#registrarProtocolList").val(),
				"RegistrarHost": $("#registrarHostList").val(),
				"RegistrarPort": $("#registrarPort").val(),
				"SetupProtocol": $("#setupProtocolList").val(),
				"SetupHost": $("#setupHostList").val(),
				"SetupPort": $("#setupPort").val(),
				"DemoAppsURL" : $("#demoAppsURL").val(),
				"RegistrarToken" : $("#registrarToken").val(),
				"ResourceServerProtocol": $("#resourceServerProtocolList").val(),
				"ResourceServerPort": $("#resourceServerPort").val(),
				"NotificationDeviceToken": $("#notificationDeviceToken").val(),
				})
			this.model.save();
			$(document).scrollTop(savedScrollTop);
		},
	    
	});
});