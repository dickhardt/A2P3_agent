$(function($) {
	'use strict';
	
	window.Agent.ScanView = Backbone.View.extend({
	
	    template:_.template($('#scan').html()),
	
		initialize: function(Opts) {
			
		},
		
	    render:function (eventName) {
	        $(this.el).html(this.template());
	        return this;
	    },
	
		events: {
	    	"click a[id=add-scan]": "addScan"
		},
	    
	    /*
	     * Event handler addScan(): 
	     */
	    addScan: function() {
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