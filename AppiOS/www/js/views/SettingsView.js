/* 
* Copyright (C) Province of British Columbia, 2013
*/

$(function($) {
	'use strict';
	
	window.Agent.SettingsView = Backbone.View.extend({
	
	    template:_.template($('#settings').html()),
	
		initialize: function(Opts) {
			this.model.on("change", this.render, this);
		},
		
	    render:function (eventName) {
	       	this.$el.html(this.template(this.model.toJSON()));
	        
	        // force jquery to restyle
	    	$(this.el).trigger("pagecreate");
	    	
	        return this;
	    },
	
		events: {
			"click a[id=reset]": "reset",
			"click a[id=cancel]": "cancel",
			"click a[id=confirm]": "confirm",
			"click a[id=edit]": "edit",
			"click a[id=a2p3link]": "a2p3netNav",
			"popupbeforeposition div[id=resetDialogue]": "stopTouchOutOfPop"
		},
	
		stopTouchOutOfPop: function () {
        	$('.ui-popup-screen').off();
       	},
    	
		a2p3netNav: function () {
			window.location.href = "http://a2p3.net";
		},
		
		cancel: function () {
			this.$("#resetDialogue").popup("close");
		},
		
		reset: function () {
			this.$("#resetDialogue").popup("open", 
				{transition: "pop",
				 shadow: true});
		},
		
		edit: function () {
			app.dev();
		},
		
		confirm: function(ev) {
			var resetto = $(ev.currentTarget).data('resetto');
			
			console.log("Resetting to " + resetto);
			
		   // Reset model
		   this.model.reset(resetto);
		   
		   // Redo notificaitons
		   notification.register();
		  
		   // go home
		   app.navigate("#home", true);
		}, 
	});
});