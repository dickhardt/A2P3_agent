/* 
* Copyright (C) Province of British Columbia, 2013
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