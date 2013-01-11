/* 
* Copyright (C) Province of British Columbia, 2013
*/

$(function($) {
	'use strict';
	
	window.Agent.EnrollmentView = Backbone.View.extend({
	
	    template:_.template($('#enroll').html()),
	
		initialize: function() {
			this.model.bind('register', this.render, this);
		},
		
		events: {
	      "click a[id=enrollButton]"   : "submitPasscode",
	    },
	    
	    render:function (eventName) {
	    	console.log("render");
	       	this.$el.html(this.template(this.model.toJSON()));
	        
	        return this;
	    },
	    
	    submitPasscode: function () {
	    	// Assemble the passcode
	    	var passcode = $("#passcode1").val() + $("#passcode2").val() 
	    		+ $("#passcode3").val() + $("#passcode4").val();
	    	
	    	// Validate - should be in model code	
	    	if (passcode.length < 4) {
	    		// TODO: notify user
	    		return;
	    	}
	    	
	    	this.model.register("1234")	
	    }
	});
});