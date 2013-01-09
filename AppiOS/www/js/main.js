/* 
* Copyright (C) Province of British Columbia, 2013
*/
$(document).ready(function () {
    console.log('main begin');
	settings = new window.Agent.Settings();
    app = new window.Agent.AppRouter();
    Backbone.history.start();
	console.log('main end');
});


