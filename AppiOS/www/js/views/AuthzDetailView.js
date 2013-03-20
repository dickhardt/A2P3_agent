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
	
	window.Agent.AuthzDetailView = Backbone.View.extend({

	    template:_.template($('#authzDetail').html()),
	
		initialize: function() {
			// watch the authZ model for changes
			this.model.on("change", this.render, this);
			
			// Follow reference for convience
			this.app = this.model.get("Apps")[this.id];
		},
		
	    render:function (eventName) {
	        $(this.el).html(this.template(this.model.toJSON()));
	        
	        // Init
	       	this.$("#messageBar").hide();
	        this.$("#messageBar").text("");
	       
	        // If the model has any errors, show them
	   		if (this.model.get("ErrorMessage")) {
	   			this.$("#messageBar").text(this.model.get("ErrorMessage"));
	        	this.$("#messageBar").show();
	        	
	   		}
	        
	        // force jquery to restyle
	    	$(this.el).trigger("pagecreate");
	        
	        return this;
	    },
	
		events: {
			"click a[id=back]": "back",
	    },
	    
	  
	    /*
	     * Event for Authorization buttons
	     */
	    back: function () {
	    	// go back
	    	app.authz(this.model, true)
	    }
	    
	});
});