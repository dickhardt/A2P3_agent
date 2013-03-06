/* 
* Copyright (C) 2013 Sierra Systems Group Inc.
*
* Permission is hereby granted, free of charge, to any person obtaining a 
* copy of this software and associated documentation files (the "Software"), 
* to deal in the Software without restriction, including without limitation 
* the rights to use, copy, modify, merge, publish, distribute, sublicense, 
* and/or sell copies of the Software, and to permit persons to whom the 
* Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included 
* in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS 
* OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL 
* THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
* DEALINGS IN THE SOFTWARE.
*
*/

$(function($) {
	'use strict';
	
	window.Agent.AgentRequestView = Backbone.View.extend({
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
			this.model.bind("change:ResourceServersTotal", this.render, this);
			this.model.bind("change:ResourceServersLoaded", this.render, this);
			this.model.bind("change:AppId", this.render, this);
			this.model.bind("change:Authorized", this.render, this);
			this.model.bind("change:Report", this.render, this);
			this.model.bind("change:ReportConfirmed", this.render, this);
			
		},
		
		events: {
	      "tap a[id=allowButton]" : "allow",
	      "tap a[id=dontAllowButton]": "dontAllow",
	      "tap a[id=report]": "report",
	      "tap a[id=back]": "back",
	      "tap a[id=cancelReport]": "cancelReport",
	      "tap a[id=confirmReport]": "confirmReport",
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
	        this.$("#home").hide();
	        this.$("#back").hide();
	        this.$("#reportContainer").hide();
	        this.$("#reportFooter").hide();
	   		this.$("#report").show();
	   		this.$("#reportConfirmedContainer").hide();
	   		this.$("#reportConfirmedFooter").hide();
	   		
	   		
	   		// lttiel workaround for a jquery bug
	   		this.$("#header").show();
	   		this.$("#abortHeader").hide();
	        
	        var statusMessage = this.model.get("StatusMessage");
	        if (statusMessage) {
	        	this.$("#loadingBar").show();
	        	this.$("#loadingBar").text(statusMessage);
	        }
	        
	        if (this.model.get("Abort") == true) {
	        	this.$("#home").show();
	        	this.$("#header").hide();
	   			this.$("#abortHeader").show();
	        }
	        else if (this.model.get("ReportConfirmed") == true) {
	        	this.$("#reportConfirmedContainer").show();
	        	this.$("#report").hide();
	        	this.$("#reportConfirmedFooter").show();
	        }
	        else if (this.model.get("Report") == true) {
	        	this.$("#reportContainer").show();
	        	this.$("#report").hide();
	        	this.$("#reportFooter").show();
	        }
	   		else if (this.model.get("AuthorizeFlag") == true &&
	   			this.model.get("Authorized") == false &&
	   			this.model.get("ResourceIds").length > 0) { 
	   			this.$("#authZContainer").show();
	   			this.$("#authZFooter").show();
	   			
	   			
	   			var resourceServersLoaded = this.model.get("ResourceServersLoaded");
	   			var resourceServerTotal = this.model.get("ResourceServersTotal");
		   		if (resourceServersLoaded < resourceServerTotal) {
		   			this.$("#loadingBar").text("Loaded " + resourceServersLoaded + " of " + resourceServerTotal + " resource servers");
		   			this.$("#loadingBar").show();
		   		}
	   		}
	   		else if (this.model.get("PasscodeFlag") == true &&
	   			this.model.get("Passcode").length < 4) {
                                                         
	   			this.$("#container-passcode").show();
	   			this.$("#passcodeBlock").show();
	   			this.passcodeView.focus();
	   			
	   			if (this.model.get("AuthorizeFlag") == true &&
	   				this.model.get("ResourceIds").length > 0) {
	   				this.$("#back").show();
	   			}
	   		}
	   		
	   		// If the model has any errors, show them
	   		if (this.model.get("ErrorMessage")) {
	   			this.$("#messageBar").text(this.model.get("ErrorMessage"));
	        	this.$("#messageBar").show();
	        	this.$("#loadingBar").hide();
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
	    	this.model.set("Authorized", true);
	    },
	    
	    back: function () {
	    	this.model.set("Authorized", false);
	    },
	    
	    dontAllow: function () {
	    	this.model.cancel();
	    },
	    
	    report: function () {
	    	this.model.set("Report", true);
	    },
	    
	    cancelReport: function () {
	    	this.model.set("Report", false);
	    },
	    
	    confirmReport: function () {
	    	this.model.report();
	    },
	});
});