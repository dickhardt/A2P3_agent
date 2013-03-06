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