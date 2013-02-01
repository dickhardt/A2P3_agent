$(function($) {
	'use strict';
	
	window.Agent.InfoView = Backbone.View.extend({
	
	    template:_.template($('#info').html()),
	
		initialize: function(Opts) {
			
		},
		
	    render:function (eventName) {
	        $(this.el).html(this.template());
	        return this;
	    },
	
		events: {
			"click a[id=a2p3link] ": "navA2P3"
	    },
	    
	    navA2P3: function () {
	    	window.location.href = "http://a2p3.net";
	    }
	    
	});
});