/* 
* Copyright (C) Province of British Columbia, 2013
*/

$(function($) {
	'use strict';
	
	window.Agent.EnrollmentView = Backbone.View.extend({
	
	    template:_.template($('#enroll').html()),
	
		initialize: function() {
			this.model.bind('register', this.render, this);
		},
		
		events: {
	      "click a[id=start]"   : "submitPasscode",
	    },
	    
	    render:function (eventName) {
	    	console.log("render");
	       	this.$el.html(this.template(this.model.toJSON()));
	        
	        return this;
	    },
	    
	    submitPasscode: function () {
	    	this.model.register("1234")	
	    }
	});
});