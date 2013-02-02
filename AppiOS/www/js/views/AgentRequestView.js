/* 
* Copyright (C) Province of British Columbia, 2013
*/

$(function($) {
	'use strict';
	
	window.Agent.AgentRequestView = Backbone.View.extend({
		NumberOfAuthZs: 0,
	    template:_.template($('#agentrequest').html()),
	
		initialize: function() {
			this.model.bind("change", this.render, this);
			this.model.bind("change:Passcode", this.login, this);
			this.model.bind("change:ClientAppErrorCode", this.cancel, this);
			this.model.bind("change:AppName", this.force, this);
			
			this.NumberOfAuthZs = 0;
		},
		
		events: {
	      "click a[id=login]"   : "login",
	      "click a[id=allowButton]" : "allow",
	      "click a[id=dontAllowButton]": "dontAllow",
	      "click a[id=cancel]": "cancel",
	      "pageshow" : "onPageShow",
	    },
	    
	    onPageShow: function () {
	    	//if (!this.firstRendered) {
	    		this.passcodeView.focus();
	    	//}
	    },
	    
	    force: function () {
	    	this.render(true);
	    },
	    
	    render:function (force) {
	    	
	    	// if we're looking at the passcode 
	    	// and we don't have an error
	    	// and its not the first render
	    	// then don't render (stops flickery focus on iPhone)
	    	if (!force) {
		    	if (this.model.get("PasscodeFlag") == true &&
		   			this.model.get("Passcode").length < 4 &&
		   			this.model.get("ErrorMessage").length < 1 &&
		   			this.firstRendered) {
		   				//console.log("eating render");
		   				return; // eat the event
	   			}
   			}
	    	this.$el.html(this.template(this.model.toJSON()));
	    	//console.log("model contents on render = " + JSON.stringify(this.model));
   			
	        // Add in passcode view
	        this.passcodeView = new window.Agent.PasscodeView({model: this.model});
	        this.passcodeView.bind("cancel", this.cancel);
	        this.$("#container-passcode").append(this.passcodeView.render().el);
	        this.passcodeView.focus();
	        
	        // init 
	        this.$("#passcodeBlock").hide();
	        this.$("#container-passcode").hide();
	        this.$("#authZContainer").hide();
	        this.$("#authZFooter").hide();
	        this.$("#messageBar").hide();
	        this.$("#noAuthCopy").hide();
	        this.$("#authCopy").hide();
	        this.$("#messageBar").text("");
	        
	        if (this.model.get("Abort") == true) {
	        	console.log("Abort view");
	        }
	   		else if (this.model.get("PasscodeFlag") == true &&
	   			this.model.get("Passcode").length < 4) {
	   			this.$("#container-passcode").show();
	   			this.passcodeView.focus();
	   			this.$("#passcodeBlock").show();
	   			
	   			// Which authZ message to show
	   			var numberOfAuthZ = this.model.get("ResourceIds").length;
	   			if (numberOfAuthZ &&
	   				numberOfAuthZ > 0) {
	   				this.$("#authCopy").show();	
	   				this.NumberOfAuthZs = numberOfAuthZ;
				}
				else {
					this.$("#noAuthCopy").show();
				}
	   				
	   		}
	   		else if (this.model.get("AuthorizeFlag") == true &&
	   			this.model.get("Authorized") == false &&
	   			this.model.get("ResourceIds").length > 0) { 
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
		    	// If already allowed or authZ not required or zero resources 
		    	// start the process
		    	if (this.model.get("AuthorizeFlag") == false ||
		    		this.model.get("Authorized") == true ||
		    		this.model.get("ResourceIds").length < 1) {
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