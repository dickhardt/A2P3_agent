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
			"click a[id=reset]": "reset",
			"click a[id=save]": "save",
		},
		
		reset: function() {
			// prompt user to confirm and then destroy
			var result = confirm("Are you sure to reset to default settings?", null, "Confirm", "Reset");
			if (result == true) {
			   // Reset model
			   this.model.reset();
			   
			   // Notify user
			   window.Agent.Notify("Agent has been reset to default settings.");
			   
			   // Route back to this page
			   app.settings();
			   
			}
			
		},
		
		/*
		 * Save the model and go back home
		 */
		save: function () {
			this.model.set({"Name" : $("#name").val(), 
				"DeviceId" : $("#id").val(),
				"AuthenticationServerURL" : $("#authenticationServerURL").val(),
				"DemoAppsURL" : $("#demoAppsURL").val(),
				"RegistrarToken" : $("#registrarToken").val(),
				})
			this.model.save();
			app.navigate("", true);
		},
	    
	});
});