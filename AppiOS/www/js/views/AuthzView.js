$(function($) {
	
	window.Agent.AuthzView = Backbone.View.extend({
	
	    template:_.template($('#authz').html()),
	
		initialize: function() {
			// watch the authZ model for changes
			this.model.on("change:Apps", this.render, this);
			this.model.on("change:ErrorMessage", this.render, this);
			this.model.on("change:ResourceServersTotal", this.render, this);
			this.model.on("change:ResourceServersLoaded", this.render, this);
			this.model.on("change:ResourceDescriptions", this.render, this);
		},
		
	    render:function (eventName) {
	        $(this.el).html(this.template(this.model.toJSON()));
	        
	        // Init
	       	this.$("#messageBar").hide();
	        this.$("#messageBar").text("");
	        this.$("#loadingBar").hide();
	        this.$("#loadingBar").text("");
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
	   		else {
	   			// We need to show how many to load cause this can take awhile
		   		var resourceServerTotal = this.model.get("ResourceServersTotal");
		   		
		   		if (resourceServerTotal == undefined) {
	   				this.$("#loadingBar").text("Calling Registrar...");
		   			this.$("#loadingBar").show();
   				}
		   		else {
			   		var resourceServersLoaded = this.model.get("ResourceServersLoaded");
			   		if (resourceServersLoaded < resourceServerTotal) {
			   			this.$("#loadingBar").text("Loaded " + resourceServersLoaded + " of " + resourceServerTotal + " resource servers");
			   			this.$("#loadingBar").show();
	   				}
	   			}
	   		
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