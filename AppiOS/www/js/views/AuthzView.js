$(function($) {
	
	window.Agent.AuthzView = Backbone.View.extend({
	
	    template:_.template($('#authz').html()),
	
		initialize: function() {
			// watch the authZ model for changes
			this.model.on("change:Apps", this.render, this);
			this.model.on("change:ErrorMessage", this.render, this);
		},
		
	    render:function (eventName) {
	        $(this.el).html(this.template(this.model.toJSON()));
	        
	        // Init
	        var loading = true;
	       	this.$("#messageBar").hide();
	        this.$("#messageBar").text("");
	        this.$("#noAuthZContent").hide();
	        
	        // If the model has any errors, show them
	   		if (this.model.get("ErrorMessage")) {
	   			this.$("#messageBar").text(this.model.get("ErrorMessage"));
	        	this.$("#messageBar").show();
	        	loading = false;
	   		}
	   		
	   		// If there are no authZ, show panel
	   		if (!this.model.get("ResourceServerIds") ||
	   			this.model.get("ResourceServerIds").length < 1) {
	   				
	   			this.$("#noAuthZContent").show();
	   			loading = false;
	   		}
	   		
	   		// if I have at least one app, then dismiss spinnner
	   		if (!_.isEmpty(this.model.get("Apps"))) {
	   			loading = false;
	   		}
	   		
	   		// Do loading message
	   		if (loading == true) {
		   		$.mobile.loading( 'show', {
					text: 'Loading App Authorizations',
					textVisible: true,
					theme: 'a',
					html: ""
				});
			}
   			else {
				$.mobile.loading('hide');
			}
	        
	        // force jquery to restyle
	    	$(this.el).trigger("pagecreate");
	        
	        
	        return this;
	    },
	
		events: {
			"click a[id=detail]": "detail"
	    },
	    
	    detail: function (ev) {
	    	// Get the app we're talking about
	    	var appId = $(ev.currentTarget).data('appid');
			
			// Call router with appId and full model
			app.authzDetail(appId, this.model);
	    	
	    },
	});
});