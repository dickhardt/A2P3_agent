/* 
* Copyright (C) Province of British Columbia, 2013
*/

(function() {
	'use strict';

	window.Agent.AppRouter = Backbone.Router.extend({
	
	    routes:{
	        "" : "home",
            "home" : "home",
	        "settings" : "settings",
	        "dev": "dev",
	        "authz" : "authz",
	        "authzdetail/:id" : "authzDetail",
	        "agentrequest/:id" : "agentrequest",
	        "enroll/:id" : "enroll",
	        "token/:id" : "token",
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
	        var homeView = new window.Agent.HomeView();
	        this.changePage(homeView, "slide", true);
	    },
	    
	    homeRefresh:function () {
	        var homeView = new window.Agent.HomeView();
	        this.changePage(homeView);
	    },
	    
	    homeFollow: function (url) {
	    	var homeView = new window.Agent.HomeView(url);
	    },
	    
	    homeScan: function () {
	    	var homeView = new window.Agent.HomeView();
	    	this.changePage(homeView);
	    	homeView.scan();
	    },

		/*
		 * Settings page, send in the global instance of settings
		 */
		settings:function (reverse) {
			
	        this.changePage(new window.Agent.SettingsView({model: settings}), "slide", reverse);
	    },
	    
	    /*
		 * Dev page, send in the global instance of settings
		 */
		dev:function () {
			
	        this.changePage(new window.Agent.DevView({model: settings}), "slide");
	    },

		 /*
	     * Authz page
	     */
	    authz:function (authorizations, reverse) {
	    	if (!authorizations) {
	    	 	authorizations = new window.Agent.Authorizations();
	    	}
	        this.changePage(new window.Agent.AuthzView({model: authorizations}), "slide", reverse);
	    },
	    
	    /* 
	     * AuthZ detail page
	     */
		authzDetail: function (appId, authorizations) {
			this.changePage(new window.Agent.AuthzDetailView({"id" : appId, "model" : authorizations}), "slide");
		},
		
		/* 
		 * Enroll, handles both the a2p3.net://enroll? and QR code scan
		 */
		enroll: function (cid) {
			var enrollment = enrollmentSessions.getByCid(cid);
			this.changePage(new window.Agent.EnrollmentView({model: enrollment}));
		},
		
		/*
		 * AgentRequest, handles inbound a2p3.net://token? requests
		 */
		token: function (cid) {
			console.log("Agent request starting, cid = " + cid);
			var agentRequest = agentRequestSessions.getByCid(cid);
			this.changePage(new window.Agent.AgentRequestView({model: agentRequest}));
		},
		
		/*
		 * Common function to load page
		 */
	    changePage:function (page, transition, reverse) {
	    	if (page.pageClass)
	    		$(page.el).attr({ 'data-role': 'page', 'data-theme': 'f', 'class': page.pageClass});
	    	else
	    		$(page.el).attr({ 'data-role': 'page', 'data-theme': 'f'});
	        page.render();
	        $('body').append($(page.el));
	        if (!transition) {
	        	transition = $.mobile.defaultPageTransition;
	        }
	        // We don't want to slide the first page
	        if (this.firstPage) {
	            transition = 'none';
	            this.firstPage = false;
	        }
	        $.mobile.changePage($(page.el), {changeHash:false, transition: transition,  reverse:  reverse});
	        
	        // unhide splash
	        if (navigator.splashscreen) {
	        	navigator.splashscreen.hide();
	        }
	    },
	
		/*
		 * General purpose back navigate
		 */
		back: function () {
			$.mobile.back();
		},
	
		/*
		 * Handles incoming URL from mobile device invoke
		 */
		mobileUrlInvokeHandler: function (url) {
			console.log("Handling incoming url = " + url);
			
			// parse URI and drop schema (we only support ONE IX) and drive into router
			var parsedUrl = parseUri(url);
			var path = parsedUrl.relative.replace("//", "");
	
			// Safe gaurd my AppRouter
			var justPath = rtrim(path, "?");
			
			if (jQuery.inArray(justPath, new Array("enroll", "token")) < 0) {
				console.log("Unsupported API call: " + url);
				return;
			}
			
			// Switch on path (aka operation type), TODO: could make this a factory pattern
			switch (justPath) {
				case "enroll":
					// cancel all previous sessions
					enrollmentSessions.reset();
					var enrollment = new window.Agent.Enrollment({SourceUrl: url});
					enrollmentSessions.add(enrollment);
			
					// Invoke app router
					app.navigate(justPath + "/" + enrollment.cid, true)
			
					break;
				case "token":
					// cancel all previous sessions
					//request, state, notificationUrl
					agentRequestSessions.reset();
					var agentRequest = new window.Agent.AgentRequest({SourceUrl: url});
					agentRequestSessions.add(agentRequest);
					
					// Invoke app router
					app.navigate(justPath + "/" + agentRequest.cid, true)
			
					break;
			}

		
		},
	
	});

})();