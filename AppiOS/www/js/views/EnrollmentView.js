/* 
* Copyright (C) 2013 Sierra Systems Group Inc.
*
* Permission is hereby granted, free of charge, to any person obtaining a 
* copy of this software and associated documentation files (the "Software"), 
* to deal in the Software without restriction, including without limitation 
* the rights to use, copy, modify, merge, publish, distribute, sublicense, 
* and/or sell copies of the Software, and to permit persons to whom the 
* Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included 
* in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS 
* OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL 
* THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
* DEALINGS IN THE SOFTWARE.
*
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