$(function($) {
	'use strict';
	
	window.Agent.HomeView = Backbone.View.extend({
	
	    template:_.template($('#home').html()),
	
		initialize: function(Opts) {
			
		},
		
	    render:function () {
	    	$(this.el).html(this.template());
	        
	        // init
	        this.$("#enrolled").hide();
	        this.$("#unenrolled").hide();
	        this.$("#messageBar").hide();
	        
	        // Switch on enrollment state
	        if (settings.isEnrolled()) {
	        	this.$("#enrolled").show();
	        }
	        else {
	        	 this.$("#unenrolled").show();
	        }
	        
	      	return this;
	    },
	
		events: {
			"click a[id=logonScan]" : "scan",
			"click a[id=enrollScan]" : "scan"
	    },
	   
	    /*
	     * Event handler addScan(): 
	     */
	    scan: function() {
	    	console.log("Begin scan");
	        window.plugins.barcodeScanner.scan(
                function(result) {
                    if (result.cancelled) {
                        //navigator.notification.alert("Scan Cancelled");
                    }
                    else {
                    	// Two flavours, enroll QR and logon QR
                    	// TODO: move a2p3.net into settings
                    	console.log("Scanned string = " + result.text);
                    	if (result.text.indexOf("a2p3.net") == 0) {
                    		app.mobileUrlInvokeHandler(result.text);
                    	}
                    	else if (result.text.indexOf("http") == 0) {
                    		// must call to get real a2p3 URL
                    		this.followQRCodeAgentRequestUrl(result.text);
                    	}
                    	else {
                    		// tell user we can't handle this
                    		this.displayError("Agent does not know how to handle the scanned QR: " + result.text);
                    	}
                    }
                },
                function(error) {
                	console.log("Scan failed callback");
                    this.displayError("Scanning failed with: " + error);
                }
	   		)
		},
		
		displayError: function (msg) {
			navigator.notification.alert(msg);
		},
		
		/*
		 * Function to follow HTTP requests
		 */
		followQRCodeAgentRequestUrl: function (url) {
			console.log("following url = " + url);
			// Call 
			url += "?json=true";
			$.ajax({url: url, 
				type: "GET", 
				dataType: "json",
				context: this,
				error: function (url) {
					return function (jqXHR, textStatus, errorThrown) {
						this.getAgentRequestError(jqXHR, textStatus, errorThrown, url);
					}}(url),
				success: this.getAgentRequestSuccess
				});		
		},
		
		/* 
		 * When bad things happen with get agent request
		 */
		getAgentRequestError: function (jqXHR, textStatus, errorThrown, url) {
			this.displayError("The application you are trying to logon to is unavailable at: " + url);
		},
		
		/*
		 * Callback for get agent requst from QR code
		 */
		getAgentRequestSuccess: function (data, textStatus, jqXHR) {
			console.log("data = " + JSON.stringify(data));
			if (data.result) {
				// make a2p3 URL
				var url = "a2p3.net://token?request=" + data.result.agentRequest + 
					"&state=" + data.result.state;
				app.mobileUrlInvokeHandler(url);
			}
			else {
				this.displayError.text("The application you are trying to logon had the following error: " + data);
			}
		},
	});
});