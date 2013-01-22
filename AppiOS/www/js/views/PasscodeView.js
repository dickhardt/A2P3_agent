$(function($) {
	'use strict';
	
	window.Agent.PasscodeView = Backbone.View.extend({
	
	    template:_.template($('#passcode').html()),
	
		initialize: function() {
		},
		
	    render:function () {
	        $(this.el).html(this.template());
	        return this;
	    },
	});
});