/* 
* Copyright (C) Province of British Columbia, 2013
*/

(function() {
	'use strict';

	window.Agent.AppRouter = Backbone.Router.extend({
	
	    routes:{
	        "" : "home",
	        "settings" : "settings",
	        "demo" : "demo",
	        "scan" : "scan",
	        "authz" : "authz",
	        "agentrequest/:id" : "agentrequest",
	        "enroll/:id" : "enroll",
	    },
	
	    initialize:function () {
	        // Handle back button throughout the application
	        $('.back').live('click', function(event) {
	            window.history.back();
	            return false;
	        });
	        this.firstPage = true;
	    },
	
		/*
		 * Home page, default router
		 */
		home:function () {
	        this.changePage(new window.Agent.HomeView());
	    },

		/*
		 * Settings page, send in the global instance of settings
		 */
		settings:function () {
			
	        this.changePage(new window.Agent.SettingsView({model: settings}));
	    },

	     /*
	     * Demo page
	     */
	    demo:function () {
	        this.changePage(new window.Agent.DemoView());
	    },

	     /*
	     * Scan page
	     */
	    scan:function () {
	        this.changePage(new window.Agent.ScanView());
	    },
	

		 /*
	     * Authz page
	     */
	    authz:function () {
	        this.changePage(new window.Agent.AuthzView());
	    },
	
		/*
		 * Agent Request
		 */
	
		agentrequest:function(id) 
		{
			var request = A2P3AgentRequest.get(id);
			this.changePage(new window.Agent.A2P3AgentRequestView({A2P3AgentRequest: request}));
		},
		
		/* 
		 * Enroll, handles both the a2p3.net://enroll? and QR code scan
		 */
		enroll: function (cid) {
			console.log("Enroll starting, cid = " + cid);
			var enrollment = enrollmentSessions.getByCid(cid);
			this.changePage(new window.Agent.EnrollmentView({model: enrollment}));
		},
		
		/*
		 * AgentRequest, handles inbound a2p3.net://token? requests
		 */
		token: function (request, state, notificationUrl) {
			
			
		},
		
		
		
		/*
		 * Common function to load page
		 */
	    changePage:function (page) {
	    	if (page.pageClass)
	    		$(page.el).attr({ 'data-role': 'page', 'data-theme': 'c', 'class': page.pageClass});
	    	else
	    		$(page.el).attr({ 'data-role': 'page', 'data-theme': 'c'});
	        page.render();
	        $('body').append($(page.el));
	        var transition = $.mobile.defaultPageTransition;
	        
	        // We don't want to slide the first page
	        if (this.firstPage) {
	            transition = 'none';
	            this.firstPage = false;
	        }
	        $.mobile.changePage($(page.el), {changeHash:false, transition: transition});
	    },
	
	
		/*
		 * Handles incoming URL from mobile device invoke
		 */
		mobileUrlInvokeHandler: function (url) {
			
			// parse URI and drop schema (we only support ONE IX) and drive into router
			var parsedUrl = parseUri(url);
			var path = parsedUrl.relative.replace("//", "");
	
			// Safe gaurd my AppRouter
			var justPath = rtrim(path, "?");
			
			if (jQuery.inArray(justPath, new Array("enroll", "token")) < 0) {
				console.log("Unsupported API call: " + url);
				return;
			}
			
			// TODO handle more than just enroll
			var enrollment = new window.Agent.Enrollment({SourceUrl: url});
			enrollmentSessions.add(enrollment);
			
			// Invoke app router
			app.navigate(justPath + "/" + enrollment.cid, true)
		},
	
	});

})();