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
	      "click a[id=login]"   : "login",
	      "click a[id=allowButton]" : "allow",
	      "click a[id=dontAllowButton]": "dontAllow",
	    },
	    
	    render:function (eventName) {
	    	this.$el.html(this.template(this.model.toJSON()));
	        
	        // init 
	        this.$("#passcodeContainer").hide();
	        this.$("#authZContainer").hide();
	        this.$("#authZFooter").hide();
	        this.$("#messageBar").hide();
	        this.$("#messageBar").text("");
	   		
	   		if (this.model.get("PasscodeFlag") == true &&
	   			this.model.get("Passcode").length < 1) {
	   			this.$("#passcodeContainer").show();
	   		}
	   		else if (this.model.get("AuthorizeFlag") == true &&
	   			this.model.get("Authorized") == false) { 
	   			this.$("#authZContainer").show();
	   			this.$("#authZFooter").show();
	   		}
	   		
	   		// If the model has any errors, show them
	   		if (this.model.get("ErrorMessage")) {
	   			this.$("#messageBar").text(this.model.get("ErrorMessage"));
	        	this.$("#messageBar").show();
	   		}

	        // Show/hide containers based on model state
	        var status = this.model.get("Status");
	   		switch (status) {
	   			case "Cancelled":
	   				// all done, back home
	   				app.navigate("", true);
	   				break;
	   			case "AppVerifyFailed":
	   			console.log("App verification failed!");
	   				this.$("#passcodeContainer").hide();
			        this.$("#authZContainer").hide();
			        this.$("#authZFooter").hide();
	   				break;
	   			case "Complete":
	   				// all done, back home
	   				app.navigate("", true);
	   				break;
	   		}
	   		
	     	// force jquery to restyle
	    	$(this.el).trigger("pagecreate");
	        
	        return this;
	    },
	    
	    login: function () {
	    	// Assemble the passcode
	    	var passcode = $("#passcode").val();
	    	
	    	// Validate - should be in model code	
	    	if (passcode.length != 4 ||
	    		isNaN(passcode) ) {
	    		this.$("#messageBar").text("Passcode must be 4 numbers");
	        	this.$("#messageBar").show();
	    		return;
	    	}
	    	
	    	this.model.set({"Passcode": passcode});  
	    	
	    	// If already allowed or authZ not required start the process
	    	if (this.model.get("AuthorizeFlag") == false ||
	    		this.model.get("Authorized") == true) {
	    		this.model.startGetIXToken();
	    		app.navigate("", true);
	    	}	
	    },
	    
	    allow: function () {
	    	this.model.set({"Authorized": true});
	    	this.model.startGetIXToken();
	    	app.navigate("", true);
	    },
	    
	    dontAllow: function () {
	    	this.model.set({"Authorized": false});
	    	this.model.cancel();
	    	app.navigate("", true);
	    },
	});
});