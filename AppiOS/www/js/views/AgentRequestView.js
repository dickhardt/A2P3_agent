/* 
* Copyright (C) Province of British Columbia, 2013
*/

$(function($) {
	'use strict';
	
	window.Agent.AgentRequestView = Backbone.View.extend({
		NumberOfAuthZs: 0,
	    template:_.template($('#agentrequest').html()),
	
		initialize: function() {
			this.model.bind("change:ErrorMessage", this.render, this);
			this.model.bind("change:ParsedFlag", this.render, this);
            this.model.bind("change:ResourceIds", this.render, this);
            this.model.bind("change:Passcode", this.render, this);
			this.model.bind("change:Passcode", this.login, this);
			this.model.bind("change:ClientAppErrorCode", this.cancel, this);
			this.model.bind("change:AppName", this.render, this);
			this.model.bind("change:StatusMessage", this.render, this);
			
			this.NumberOfAuthZs = '';
		},
		
		events: {
	      "tap a[id=allowButton]" : "allow",
	      "tap a[id=dontAllowButton]": "dontAllow",
	      "tap a[id=cancel]": "cancel",
	    },

	    
	    render:function (force) {
	    	// If we haven't parsed yet, wait
	    	if (this.model.get("ParsedFlag") == false)  {
	    		console.log("not parsed yet");
	    		return;
	    	}
	   
	    	this.$el.html(this.template(this.model.toJSON()));
	    	//console.log("model contents on render = " + JSON.stringify(this.model));
   			
	        // Add in passcode view
	        this.passcodeView = new window.Agent.PasscodeView({model: this.model});
	        this.passcodeView.bind("cancel", this.cancel);
	        this.$("#container-passcode").append(this.passcodeView.render().el);
	        
	        // init 
	        this.$("#passcodeBlock").hide();
	        this.$("#container-passcode").hide();
	        this.$("#authZContainer").hide();
	        this.$("#authZFooter").hide();
	        this.$("#messageBar").hide();
	        this.$("#noAuthCopy").hide();
	        this.$("#authCopy").hide();
	        this.$("#messageBar").text("");
	        this.$("#loadingBar").hide();
	        this.$("#loadingBar").text("");
	        
	        var statusMessage = this.model.get("StatusMessage");
	        if (statusMessage) {
	        	this.$("#loadingBar").hide();
	        	this.$("#loadingBar").text(statusMessage);
	        }
	        
	        if (this.model.get("Abort") == true) {
	        	console.log("Abort view");
	        }
	   		else if (this.model.get("PasscodeFlag") == true &&
	   			this.model.get("Passcode").length < 4) {
                                                         
	   			this.$("#container-passcode").show();
	   			this.$("#passcodeBlock").show();
	   			this.passcodeView.focus();
	   			
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
		    		this.model.startGetIXToken(true);
		    	}	
	    	}
	    },
	    
	    allow: function () {
	    	console.log("allow");
	    	this.model.startGetIXToken(true);
	    },
	    
	    dontAllow: function () {
	    	this.model.cancel();
	    },
	    
	    cancel: function () {
	    	this.model.cancel();
	    },
	});
});