$(function($) {
	'use strict';
	
	window.Agent.HomeView = Backbone.View.extend({
	
	    template:_.template($('#home').html()),
	
		initialize: function(Opts) {
			
		},
		
	    render:function () {
	        $(this.el).html(this.template());
	        
	        // init
	        this.$("#enrolled").hide();
	        this.$("#unenrolled").hide();
	        
	        // Switch on enrollment state
	        if (settings.isEnrolled()) {
	        	this.$("#enrolled").show();
	        }
	        else {
	        	 this.$("#unenrolled").show();
	        }
	        
	        return this;
	    },
	
		events: {
	    },
	});
});