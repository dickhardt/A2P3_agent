/* 
* Copyright (C) Province of British Columbia, 2013
*/

$(function($) {
	'use strict';
	
	window.Agent.AgentRequestView = Backbone.View.extend({
	
	    template:_.template($('#agentrequest').html()),
	
		initialize: function() {
			this.model.bind("change", this.render, this);
			this.model.bind("change:Passcode", this.login, this);
			this.model.bind("change:ClientAppErrorCode", this.cancel, this);
		},
		
		events: {
	      "click a[id=login]"   : "login",
	      "click a[id=allowButton]" : "allow",
	      "click a[id=dontAllowButton]": "dontAllow",
	      "click a[id=cancel]": "cancel",
	      "pageshow" : "onPageShow",
	    },
	    
	    onPageShow: function () {
	    	this.passcodeView.focus();
	    },
	    
	    render:function (eventName) {
	    	
	    	// if we're looking at the passcode 
	    	// and we don't have an error
	    	// and its not the first render
	    	// then don't render (stops flickery focus on iPhone)
	    	if (this.model.get("PasscodeFlag") == true &&
	   			this.model.get("Passcode").length < 4 &&
	   			this.model.get("ErrorMessage").length < 1 &&
	   			this.firstRendered) {
	   				//console.log("eating render");
	   				return; // eat the event
   			}
   			
	    	this.$el.html(this.template(this.model.toJSON()));
	    	//console.log("model contents on render = " + JSON.stringify(this.model));
   			
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

			// mark first rendered
			this.firstRendered = true;

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
	    	console.log("allow");
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