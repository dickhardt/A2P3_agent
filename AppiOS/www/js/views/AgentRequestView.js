/* 
* Copyright (C) Province of British Columbia, 2013
*/

$(function($) {
	'use strict';
	
	window.Agent.AgentRequestView = Backbone.View.extend({
	
	    template:_.template($('#agentrequest').html()),
	
		initialize: function() {
			// Optimized for listening on attributes that matter to the 
			// view
			this.model.bind("change:Authorized", this.render, this);
			this.model.bind("change:ResourceDescriptions", this.render, this);
			this.model.bind("change:AppName", this.render, this);
			this.mobel.bind("change:ErrorMessage", this.render, this);
			this.model.bind("change:Passcode", this.login, this);
			this.model.bind("change:Passcode", this.render, this);
			this.model.bind("change:ClientAppErrorCode", this.cancel, this);
		},
		
		events: {
	      "click a[id=login]"   : "login",
	      "click a[id=allowButton]" : "allow",
	      "click a[id=dontAllowButton]": "dontAllow",
	      "pageshow" : "onPageShow",
	    },
	    
	    onPageShow: function () {
	    	this.passcodeView.focus();
	    },
	    
	    render:function (eventName) {
	    	this.$el.html(this.template(this.model.toJSON()));
	        
	        // Add in passcode view
	        this.passcodeView = new window.Agent.PasscodeView({model: this.model});
	        this.passcodeView.bind("cancel", this.cancel);
	        this.$("#container-passcode").append(this.passcodeView.render().el);
	        
	        // init 
	        this.$("#container-passcode").hide();
	        this.$("#authZContainer").hide();
	        this.$("#authZFooter").hide();
	        this.$("#messageBar").hide();
	        this.$("#messageBar").text("");
	   		
	   		if (this.model.get("PasscodeFlag") == true &&
	   			this.model.get("Passcode").length < 4) {
	   			this.$("#container-passcode").show();
	   			this.passcodeView.focus();
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
	   		
	     	// force jquery to restyle
	    	$(this.el).trigger("pagecreate");

	        return this;
	    },
	    
	    login: function () {
	    	var passcode = this.model.get("Passcode");
			if (passcode.length >= 4) {
		    	// If already allowed or authZ not required start the process
		    	if (this.model.get("AuthorizeFlag") == false ||
		    		this.model.get("Authorized") == true) {
		    		this.model.startGetIXToken();
		    	}	
	    	}
	    },
	    
	    allow: function () {
	    	this.model.set({"Authorized": true});
	    	this.model.startGetIXToken();
	    },
	    
	    dontAllow: function () {
	    	this.model.set({"Authorized": false});
	    	this.model.cancel();
	    },
	    
	    cancel: function () {
	    	this.model.set({"Authorized": false});
	    	this.model.cancel();
	    },
	});
});