/* 
* Copyright (C) Province of British Columbia, 2013
*/

$(function($) {
	'use strict';
	
	window.Agent.SettingsView = Backbone.View.extend({
	
	    template:_.template($('#settings').html()),
	
		initialize: function(Opts) {
			this.model.on("change", this.render, this);
		},
		
	    render:function (eventName) {
	    	console.log(this.model);
	       	this.$el.html(this.template(this.model.toJSON()));
	        
	        // force jquery to restyle
	    	$(this.el).trigger("pagecreate");
	    	
	    	// Select our drop down lists
	    	this.$("#authenticationServerProtocolList").val(this.model.get("AuthenticationServerProtocol"));
	    	this.$("#authenticationServerHostList").val(this.model.get("AuthenticationServerHost"));
	    	this.$("#registrarProtocolList").val(this.model.get("RegistrarProtocol"));
	   		this.$("#registrarHostList").val(this.model.get("RegistrarHost"));
	    	this.$("#resourceServerProtocolList").val(this.model.get("ResourceServerProtocol"));
	    	this.$("#setupProtocolList").val(this.model.get("SetupProtocol"));
	    	this.$("#setupHostList").val(this.model.get("SetupHost"));
	    	
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
		
		confirm: function(resetto) {

			console.log("Resetting");
		
		   // Reset model
		   this.model.reset(resetto);
		   
		   // Redo notificaitons
		   notification.register();
		  
		},
		
		/*
		 * Save the model and go back home
		 */
		save: function () {
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
			app.navigate("", true);
		},
	    
	});
});