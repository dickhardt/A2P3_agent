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
	      "click a[id=allowButton]" : "allow",
	      "click a[id=dontAllowButton]": "dontAllow",
	    },
	    
	    render:function (eventName) {
	    	this.$el.html(this.template(this.model.toJSON()));
	        
	        // init 
	        this.$("#passcodeContainer").hide();
	        this.$("#authZContainer").hide();
	        
	        // Show/hide containers based on model state
	        var state = this.model.getState();
	   console.log(state);
	   		switch (state) {
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
	   		
	     	// force jquery to restyle
	    	$(this.el).trigger("pagecreate");
	        
	        return this;
	    },
	    
	    submitPasscode: function () {
	    	// Assemble the passcode
	    	var passcode = $("#passcode").val();
	    	
	    	// Validate - should be in model code	
	    	if (passcode.length != 4) {
	    		UnhandledError("Passcode not 4 characters.");
	    		return;
	    	}
	    	
	    	this.model.set({"Passcode": passcode});  	
	    },
	    
	    allow: function () {
	    	this.model.set({"Authorized": true});
	    	this.model.startGetIXToken();
	    },
	    
	    dontAllow: function () {
	    	this.model.set({"Authorized": false});
	    	this.model.cancel();
	    	app.home();
	    },
	});
});