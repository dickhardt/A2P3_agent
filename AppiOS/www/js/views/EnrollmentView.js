/* 
* Copyright (C) Province of British Columbia, 2013
*/

$(function($) {
	'use strict';
	
	window.Agent.EnrollmentView = Backbone.View.extend({
	
	    template:_.template($('#enroll').html()),
	    
	    message: '',
	
		initialize: function() {
			this.model.bind("change", this.render, this);
		},
		
		events: {
	      "click a[id=enrollButton]"   : "submitPasscode",
	    },
	    
	    render:function (eventName) {
	    	this.$el.html(this.template(this.model.toJSON()));
	        
	        // Init
	        this.$("#messageBar").hide();
	        this.$("#messageBar").text("");
	        
	        // Show/hide containers based on model state
	        var status = this.model.get("Status");
	        switch (status) {
	        	case "Error":
	        		this.$("#messageBar").text(this.model.get("ErrorMessage"));
	        		this.$("#messageBar").show();
	        		break;
	        }
	        
	        // force jquery to restyle
	    	$(this.el).trigger("pagecreate");
	       
	        return this;
	    },
	    
	    submitPasscode: function () {
	    	// Assemble the passcode
	    	var passcode = $("#passcode").val();
	    	
	    	// Validate - should be in model code	
	    	if (passcode.length != 4 ||
	    		isNaN(passcode) ) {
	    		this.$("#messageBar").text("Passcode must be 4 numbers");
	        	this.$("#messageBar").show();
	    		return;
	    	}
	    	
	    	this.model.register(passcode);	
	    	
	    	
	    }
	});
});