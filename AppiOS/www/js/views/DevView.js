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
	
	window.Agent.DevView = Backbone.View.extend({
	
	    template:_.template($('#dev').html()),
	
		initialize: function(Opts) {
			this.model.on("change", this.render, this);
		},
		
	    render:function (eventName) {
	       	this.$el.html(this.template(this.model.toJSON()));
	        
	        // Select our drop down lists
	    	this.$("#authenticationServerProtocolList").val(this.model.get("AuthenticationServerProtocol"));
	    	this.$("#authenticationServerHostList").val(this.model.get("AuthenticationServerHost"));
	    	this.$("#registrarProtocolList").val(this.model.get("RegistrarProtocol"));
	   		this.$("#registrarHostList").val(this.model.get("RegistrarHost"));
	    	this.$("#resourceServerProtocolList").val(this.model.get("ResourceServerProtocol"));
	    	this.$("#setupProtocolList").val(this.model.get("SetupProtocol"));
	    	this.$("#setupHostList").val(this.model.get("SetupHost"));
	    	
	    	// force jquery to restyle
	    	$(this.el).trigger("pagecreate");
	    	
	        return this;
	    },
	
		events: {
			"click a[id=back]": "back",
			"change input": "save",
			"change select": "save",
		},
		
		back: function () {
			app.settings(true);
		},
		
		/*
		 * Save the model and go back home
		 */
		save: function () {
			var savedScrollTop = $(document).scrollTop();
			this.model.set({"Name" : $("#name").val(), 
				"DeviceId" : $("#id").val(),
				"AuthenticationServerProtocol": $("#authenticationServerProtocolList").val(),
				"AuthenticationServerHost": $("#authenticationServerHostList").val(),
				"AuthenticationServerPort": $("#authenticationServerPort").val(),
				"RegistrarProtocol": $("#registrarProtocolList").val(),
				"RegistrarHost": $("#registrarHostList").val(),
				"RegistrarPort": $("#registrarPort").val(),
				"SetupProtocol": $("#setupProtocolList").val(),
				"SetupHost": $("#setupHostList").val(),
				"SetupPort": $("#setupPort").val(),
				"DemoAppsURL" : $("#demoAppsURL").val(),
				"RegistrarToken" : $("#registrarToken").val(),
				"ResourceServerProtocol": $("#resourceServerProtocolList").val(),
				"ResourceServerPort": $("#resourceServerPort").val(),
				"NotificationDeviceToken": $("#notificationDeviceToken").val(),
				})
			this.model.save();
			$(document).scrollTop(savedScrollTop);
		},
	    
	});
});