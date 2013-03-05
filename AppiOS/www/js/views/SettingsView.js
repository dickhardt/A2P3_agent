/* 
* Copyright (C) Province of British Columbia, 2013
*/

$(function($) {
	'use strict';
	
	window.Agent.SettingsView = Backbone.View.extend({
	
	    template:_.template($('#settings').html()),
	
		initialize: function(Opts) {
			this.model.on("change", this.render, this);
			this.editMode = false;
		},
		
	    render:function (eventName) {
	       	this.$el.html(this.template(this.model.toJSON()));
	        
	        // init
	        this.$("#viewContainer").hide();
	        this.$("#editContainer").hide();
	        this.$("#viewHeader").hide();
	        this.$("#editHeader").hide();
	        
	        // switch containers based on mode
	        if (this.editMode) {
	        	this.$("#editContainer").show();
	        	this.$("#editHeader").show();
	        	
	        }
	        else {
	        	this.$("#viewContainer").show();
	        	this.$("#viewHeader").show();
	        }
	        
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
			"tap a[id=reset]": "reset",
			"tap a[id=cancel]": "cancel",
			"tap a[id=confirm]": "confirm",
			"tap a[id=edit]": "toggleMode",
			"tap a[id=back]": "toggleMode",
			"change input": "save",
			"change select": "save",
		},
		
		cancel: function () {
			this.$("#resetDialogue").popup("close");
		},
		
		reset: function () {
			this.$("#resetDialogue").popup("open", 
				{transition: "pop",
				 shadow: true});
		},
		
		toggleMode: function () {
			this.editMode = !this.editMode;
			this.render();
		},
		
		confirm: function(ev) {
			var resetto = $(ev.currentTarget).data('resetto');
			
			console.log("Resetting to " + resetto);
			
		   // Reset model
		   this.model.reset(resetto);
		   
		   // Redo notificaitons
		   notification.register();
		  
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