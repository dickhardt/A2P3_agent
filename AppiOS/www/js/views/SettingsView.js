/* 
* Copyright (C) 2013 Sierra Systems Group Inc.
*
* Permission is hereby granted, free of charge, to any person obtaining a 
* copy of this software and associated documentation files (the "Software"), 
* to deal in the Software without restriction, including without limitation 
* the rights to use, copy, modify, merge, publish, distribute, sublicense, 
* and/or sell copies of the Software, and to permit persons to whom the 
* Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included 
* in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS 
* OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL 
* THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
* DEALINGS IN THE SOFTWARE.
*
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