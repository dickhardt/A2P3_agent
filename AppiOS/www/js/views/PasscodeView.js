/* 
* Copyright (C) Province of British Columbia, 2013
*/

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
			
			if (passcode.length >= 4) {
				this.model.set("Passcode", passcode);
			}
			
	    },
	    
	    /*
	     * Changes browser focus to out passcode field
	     * also prevents iOS from auto scrolling
	     */
	    focus: function () {
	    	var savedScrollTop = $(document).scrollTop();
	    	this.$("#passcode1").focus();
	    	$(document).scrollTop(savedScrollTop);
	    },

	    /*
	     * Event for when the user clicks the cancel key
	     */
	    cancel: function () {
	    	// nav home
	    	this.trigger("cancel");
	    },
	    
	    displayPromptText: function () {
	    	if (this.model.PromptText) {
	    		return this.model.PromptText;
	    	}
	    	
	    	return "Enter your passcode";
	    },
	});
});