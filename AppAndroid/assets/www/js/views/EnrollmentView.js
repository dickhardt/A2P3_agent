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
			this.model.bind("change:Passcode", this.checkPasscode, this);
			this.model.bind("complete", this.complete, this)
		},
		
		events: {
			"pageshow" : "onPageShow",
			"click a[id=cancel]": "cancel",
	    },
	    
	    onPageShow: function () {
	    	this.passcodeView.focus();
	    },
	    	    
	    
	    render:function (eventName) {
	    	this.$el.html(this.template(this.model.toJSON()));
	        
	        // Add in passcode view
	        this.model.PromptText = "Re-enter your passcode";
	        this.passcodeView = new window.Agent.PasscodeView({model: this.model});
	        this.passcodeView.bind("cancel", this.cancel);
	        this.$("#container-passcode").append(this.passcodeView.render().el);
	        this.passcodeView.focus();
	        
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
	    
	    checkPasscode: function () {
	    			
			// If we have four trigger event
			var passcode = this.model.get("Passcode");
			if (passcode.length >= 4) {
				this.model.register(passcode, this.$("#name").val());		
			}
	    },
	    
	    cancel: function () {
	    	app.navigate("", true);
	    },
	    
	      
	    complete: function () {
	    	app.navigate("", true);
	    },
	});
});