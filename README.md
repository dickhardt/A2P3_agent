# A2P3_agent #

This is a Personal Agent for a2p3.net demonstration  environment (link TBD). It is compliant with the specification of the [A2P3 protocol version 8](http://www.a2p3.ca/PDFs/A2P3%20Protocol%20draft%208.pdf "A2P3 protocol version 8").

See also: [A2P3](https://github.com/dickhardt/A2P3 "A2P3")

This Agent is target and tested on the iPhone 4-5 iOS 6.*.   

## For Developers: ##

This application makes use of the following libs/frameworks, most notably:

- phoneGap/cordova
- backbone
- underscore
- jquery mobile
- jstorage
- various phonegap plugins

To run locally in a web browser:

- Disable the cross domain policy in your browser, e.g.,   

		Chrome:
			chrome.exe --disable-web-security

- Run through web server to stop the local file cross domain policy protection.

Some device specific functions will not work including:

- QR Code Scanning
- Custom schema (a2p3.net://token?request=...) handling from the OS.  

		You can invoke the javascript function directly in a browser console by calling handleOpenURL(url); 
- Push Notifications (TBD on how to do this manually)

There is a .project file for the [Aptana software](http://www.aptana.com/ "Aptana").

## For Designers: ##
The Agent makes use of [jquery mobile controls](http://jquerymobile.com/test/).  Any application specific styles should use the [app.css](https://github.com/dickhardt/A2P3_agent/blob/master/AppiOS/www/css/app.css) to override or append styles.

Design guidelines:

- Clean, simple and minimal
- Agent must be distinguishable from other A2P3 apps


