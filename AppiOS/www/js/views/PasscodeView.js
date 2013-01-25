$(function($) {
	'use strict';
	
	window.Agent.PasscodeView = Backbone.View.extend({
	
	    template:_.template($('#passcode').html()),
	
		initialize: function() {
		},
		
		events: {
			"keyup input[id=passcode1]": "keyClicked",
		},
		
	    render:function () {
	        $(this.el).html(this.template());
	        
	        // pull out passcode
	        var passcode = this.model.get("Passcode");
	        
	        // Put passcode into boxes
	        this.$("#passcode1").val(passcode);
	  
	        return this;
	    },
	    
	    /*
	     * Event for when the types in keypad
	     */
	    keyClicked: function (ev) {   	 
	    	// Pull passcodes from boxes
	        var passcode = this.$("#passcode1").val();
			
			this.model.set("Passcode", passcode);
			
			
	    },

	    /*
	     * Event for when the user clicks the cancel key
	     */
	    cancel: function () {
	    	// nav home
	    	this.trigger("cancel");
	    },
	    
	    /*
	     * Event for when the clicks the X backspace key
	     */
	    backspace: function () {
	    	// remove last one
	    	var passcode = this.model.get("Passcode");
	    	if (passcode > 0) {
				passcode = passcode.substring(0, passcode.length - 1);
			
				this.model.set("Passcode", passcode);
			}
	    },
	});
});