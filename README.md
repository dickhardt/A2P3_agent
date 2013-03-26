# A2P3_agent #

This is a Personal Agent for [a2p3.net demonstration  environment](http://www.a2p3.net/). It is compliant with the specification of the [A2P3 protocol version 9](http://www.a2p3.ca/PDFs/A2P3%20Protocol%20draft%209.pdf "A2P3 protocol version v0.9").

The Agent targets iOS 4.3-6 for the iPhone and iPad.

The Agent has been tested on the iPhone 4-5 iOS 5-6 and iPad iOS 5-6.   

## For Developers: ##

This application makes use of the following libs/frameworks, most notably:

- phoneGap/cordova
- backbone
- underscore
- jquery mobile
- jstorage
- various phonegap plugins

To run Agent locally in a web browser:

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

To run Agent on iPhone with using local IP addresses or if you need to sniff traffic:

- Create an ad-hoc wireless network on computer
- Configure iPhone to to use that wireless network
- Install a HTTP proxy on computer such as Fiddler2
- Edit wireless settings on iPhone to use that proxy

## For Designers: ##
The Agent makes use of [jquery mobile controls](http://jquerymobile.com/test/).  Any application specific styles should use the [app.css](https://github.com/dickhardt/A2P3_agent/blob/master/AppiOS/www/css/app.css) to override or append styles.

Design guidelines:

- Clean, simple and minimal
- Agent must be distinguishable from other A2P3 apps

## Tips and Tricks:

The global function handleOpenUrl(url) can be used to trigger the enrollment direct and login direct.

For debugging on mobile, [jsconsole](http://jsconsole.com) can be very handy especially where you have to run a deployment signed application (which can't be debugged in XCode).

## Related

[A2P3 project home page](http://www.a2p3.net)

[A2P3_specs](https://github.com/dickhardt/A2P3_specs) Specifications and POC documentation

[A2P3](https://github.com/dickhardt/A2P3) POC Server implementation source (node.js)

[A2P3_bank](https://github.com/dickhardt/A2P3_bank) POC mobile bank app (PhoneGap)

[node-a2p3](https://github.com/dickhardt/node-a2p3) node.js npm module for A2P3 applications

[sample-node-a2p3](https://github.com/dickhardt/sample-node-a2p3) sample A2P3 application using node-a2p3

[rs-sample-node-a2p3](https://github.com/dickhardt/rs-sample-node-a2p3) sample A2P3 resource server using node-a2p3

## License
MIT License

Copyright (c) 2013 Province of British Columbia

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.

IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

		
