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
	    
	    onPageShow: function () {
	    	this.passcodeView.focus();
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
                    }
                },
                function(error) {
                	console.log("Scan failed callback");
                    navigator.notification.alert("scanning failed: " + error);
                }
	   		)
		},
		
		
		/*
		 * Function to follow HTTP requests
		 */
		followQRCodeAgentRequestUrl: function (url) {
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
			console.log("bad things happended");
		},
		
		/*
		 * Callback for get agent requst from QR code
		 */
		getAgentRequestSuccess: function (data, textStatus, jqXHR) {
			console.log("data = " + data);
			if (data.result) {
				app.mobileUrlInvokeHandler(data.result);
			}
		},
	});
});