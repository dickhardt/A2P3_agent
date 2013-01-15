/* 
* Copyright (C) Province of British Columbia, 2013
*/

$(function($) {
	'use strict';
	
	window.Agent.EnrollmentView = Backbone.View.extend({
	
	    template:_.template($('#enroll').html()),
	
		initialize: function() {
			this.model.bind("change", this.render, this);
		},
		
		events: {
	      "click a[id=enrollButton]"   : "submitPasscode",
	    },
	    
	    render:function (eventName) {
	    	this.$el.html(this.template(this.model.toJSON()));
	        
	        // Show/hide containers based on model state
	        var status = this.model.get("Status");
	        
	        //if (status == "Complete") {
	        //	$("#passcodeContainer").hide();
	        //}
	        
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
	    	
	    	this.model.register(passcode);	
	    	
	    	
	    }
	});
});