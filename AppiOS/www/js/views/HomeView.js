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
			"click a[id=enrollScan]" : "scan",
	    },
	    
	    	    
	    /*
	     * Event handler addScan(): 
	     */
	    scan: function() {
	    	console.log("Begin scan");
	        window.plugins.barcodeScanner.scan(
                function(result) {
                	console.log("Scan success callback");
                    if (result.cancelled) {
                        navigator.notification.alert("Scan Cancelled");
                    }
                    else {
                    	// Two flavours, enroll QR and logon QR
                    	// Simple logic, if it starts with "a2p3.net" then its a logon QR
                    	// TODO: move a2p3.net into settings
                    	if (result.text.indexOf("a2p3.net") == 0) {
                    		app.mobileUrlInvokeHandler(result.text);
                    	}
                    	else {
                    		// TODO: It'd be nice if both QR came in as URLs, talk to Dick
                    		app.mobileUrlInvokeHandler("a2p3.net://enroll?code=" + result.text);
                    	}
                    }
                },
                function(error) {
                	console.log("Scan failed callback");
                    navigator.notification.alert("scanning failed: " + error);
                }
	   		)
	        
		},
	});
});