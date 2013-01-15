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
	      "click a[id=enrollButton]"   : "submitPasscode",
	      "click a[id=authZButton]" : "userAuthZ",
	    },
	    
	    render:function (eventName) {
	    	this.$el.html(this.template(this.model.toJSON()));
	        
	        // init 
	        $("#passcodeContainer").hide();
	        $("#authorizationContainer").hide();
	        
	        // Show/hide containers based on model state
	        var status = this.model.get("Status");
	   
	   		switch (status) {
	   			case "GetPasscode":
	   				$("#passcodeContainer").show();
	   				break;
	   			case "GetAuthorization":
	   				$("#authorizationContainer").show();
	   				break;
	   			case "GettingIXToken":
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
	    	
	    	this.model.getIXToken(passcode);  	
	    },
	    
	    userAuthZ: function () {
	    	
	    },
	});
});