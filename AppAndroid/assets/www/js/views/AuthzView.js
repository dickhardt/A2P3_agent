/* 
* Copyright (C) Province of British Columbia, 2013
*/

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
			
			// Set default mode
			this.editMode = false;
			
		},
		
	    render:function (eventName) {
	        $(this.el).html(this.template(this.model.toJSON()));
	        
	        // Init
	       	this.$("#messageBar").hide();
	        this.$("#messageBar").text("");
	        this.$("#loadingBar").hide();
	        this.$("#loadingBar").text("");
	        this.$("#noAuthZContent").hide();
	        this.$("#viewList").hide();
	        this.$("#editList").hide();
	        this.$("#viewHeader").hide();
	        this.$("#editHeader").hide();
	        
	        // Toggle text and icons
	        if (this.editMode) {
	        	this.$("#editHeader").show();
	        	this.$("#editList").show();
	        }
	        else {
	        	this.$("#viewHeader").show();
	        	this.$("#viewList").show();
	        }
	        
	        // If the model has any errors, show them
	   		if (this.model.get("ErrorMessage")) {
	   			this.$("#messageBar").text(this.model.get("ErrorMessage"));
	        	this.$("#messageBar").show();
	   		}
	   		
	   		// If there are no authZ, show panel
	   		if (!this.model.get("ResourceServerIds") ||
	   			this.model.get("ResourceServerIds").length < 1 ||
	   			this.model.get("ResourceServersTotal") == 0 ||
	   			(this.model.get("ResourceServersTotal") == this.model.get("ResourceServersLoaded") &&
	   			_.isEmpty(this.model.get("Apps"))) ) {
	   				
	   			this.$("#noAuthZContent").show();
	   			this.$("#edit").hide();
	   			this.$("#cancel").hide();
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
	   		
	   		if (!_.isEmpty(this.model.get("Apps"))) {
	   			this.$("#edit-cancel").show();
	   		}
	   	
	        // force jquery to restyle
	    	$(this.el).trigger("pagecreate");
	        
	        
	        return this;
	    },
	
		events: {
			"click a[id=detail]": "detail",
			"click a[id=edit]": "edit",
			"click a[id=cancel]": "cancel",
			"click a[id=delete]": "deleteApp",
			"click a[id=deleteConfirm]": "deleteAppConfirm",
			"popupbeforeposition div[id=deleteDialogue]": "stopTouchOutOfPop"
		},
	
		stopTouchOutOfPop: function () {
        	$('.ui-popup-screen').off();
       	},
       	
	    detail: function (ev) {
	    	// Get the app we're talking about
	    	var appId = $(ev.currentTarget).data('appid');
			
			// Call router with appId and full model
			app.authzDetail(appId, this.model);
	    	
	    },
	    
	    /*
	     * Toggle between edit and view modes
	     */
	    edit: function () {
	    	this.editMode = true;
	    	this.render();
	    },
	    
	    cancel: function () {
	    	this.editMode = false;
	    	this.render();	
	    },
	    
	    deleteApp: function (ev) {
	    	// Get the app we're talking about
	    	this.confirmAppId = $(ev.currentTarget).data('appid');
	    	this.confirmAppName = $(ev.currentTarget).data('appname');
	    	this.render();
	    	
			this.$("#deleteDialogue").popup("open", 
				{transition: "pop",
				 shadow: true});
		},
	      /*
	     * Event for the delete authorization button
	     */
	    deleteAppConfirm: function () {    	
	    	// Call authZ to delete/revoke authZ
	    	this.model.deleteAppAuthorizations(this.confirmAppId);
	    	
	    	this.$("#deleteDialogue").popup("close");
	    },
	    
	});
});