$(function($) {
	
	window.Agent.AuthzView = Backbone.View.extend({
	
	    template:_.template($('#authz').html()),
	
		initialize: function() {
			// watch the authZ model for changes
			this.model.on("change", this.render, this);
		},
		
	    render:function (eventName) {
	        $(this.el).html(this.template(this.model.toJSON()));
	        
	        // Init
	       	this.$("#messageBar").hide();
	        this.$("#messageBar").text("");
	        this.$("#noAuthZContent").hide();
	        
	        // If the model has any errors, show them
	   		if (this.model.get("ErrorMessage")) {
	   			this.$("#messageBar").text(this.model.get("ErrorMessage"));
	        	this.$("#messageBar").show();
	        	
	   		}
	   		
	   		// If there are no authZ, show panel
	   		if (!this.model.get("ResourceServerIds") ||
	   			this.model.get("ResourceServerIds").length < 1) {
	   				
	   			this.$("#noAuthZContent").show();
	   		}
	        
	        // force jquery to restyle
	    	$(this.el).trigger("pagecreate");
	        
	        return this;
	    },
	
		events: {
			"click a[id=delete]": "deleteApp"
	    },
	    
	    deleteApp: function (ev) {
	    	// Get the app we're talking about
	    	var appId = $(ev.currentTarget).data('appid');

	    	// Call authZ to delete/revoke authZ
	    	this.model.deleteAppAuthorizations(appId);
	    },
	});
});