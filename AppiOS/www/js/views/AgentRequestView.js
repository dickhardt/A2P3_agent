/* 
* Copyright (C) Province of British Columbia, 2013
*/

$(function($) {
	'use strict';
	
	window.Agent.AgentRequestView = Backbone.View.extend({
	
	    template:_.template($('#agentrequest').html()),
	
		initialize: function() {
			this.model.bind("change", this.render, this);
		},
		
		events: {
	      "click a[id=login]"   : "submitPasscode",
	      "click a[id=authZButton]" : "userAuthZ",
	    },
	    
	    render:function (eventName) {
	    	this.$el.html(this.template(this.model.toJSON()));
	        
	        // init 
	       this.$("#passcodeContainer").hide();
	       this.$("#authorizationContainer").hide();
	        
	        // Show/hide containers based on model state
	        var status = this.model.getState();
	   
	   		switch (status) {
	   			case "GetPasscode":
	   				this.$("#passcodeContainer").show();
	   				break;
	   			case "GetAuthorization":
	   				this.$("#authZContainer").show();
	   				break;
	   			case "Processing":
	   				// TODO: show spinner
	   				break;
	   			case "GotIXToken":
	   				// all done, back home
	   				app.home();
	   				break;
	   		}
	     
	        return this;
	    },
	    
	    submitPasscode: function () {
	    	// Assemble the passcode
	    	var passcode = $("#passcode").val();
	    	
	    	// Validate - should be in model code	
	    	if (passcode.length < 4) {
	    		// TODO: notify user
	    		return;
	    	}
	    	
	    	this.model.set({"Passcode": passcode});  	
	    },
	    
	    userAuthZ: function () {
	    	this.model.set({"Authorized": true});
	    	this.model.startGetIXToken();
	    },
	});
});