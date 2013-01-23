$(function($) {
	'use strict';
	
	window.Agent.PasscodeView = Backbone.View.extend({
	
	    template:_.template($('#passcode').html()),
	
		initialize: function() {
		},
		
		events: {
			"click a[id=1]": "keyClicked",
			"click a[id=2]": "keyClicked",
			"click a[id=3]": "keyClicked",
			"click a[id=4]": "keyClicked",
			"click a[id=5]": "keyClicked",
			"click a[id=6]": "keyClicked",
			"click a[id=7]": "keyClicked",
			"click a[id=8]": "keyClicked",
			"click a[id=9]": "keyClicked",
			"click a[id=0]": "keyClicked",
			"click a[id=cancel]": "cancel",
			"click a[id=backspace]": "backspace",
		},
		
	    render:function () {
	        $(this.el).html(this.template());
	        
	        // Put passcode into boxes
	        this.$("#passcode1").val(this.model.get("Passcode")[0]);
	        this.$("#passcode2").val(this.model.get("Passcode")[1]);
	        this.$("#passcode3").val(this.model.get("Passcode")[2]);
	        this.$("#passcode4").val(this.model.get("Passcode")[3]);
	        
	        this.$('#1').removeClass('ui-btn-active');
	        this.$('#2').removeClass('ui-btn-active');
	        this.$('#3').removeClass('ui-btn-active');
	        this.$('#4').removeClass('ui-btn-active');
	        this.$('#5').removeClass('ui-btn-active');
	        this.$('#6').removeClass('ui-btn-active');
	        this.$('#7').removeClass('ui-btn-active');
	        this.$('#8').removeClass('ui-btn-active');
	        this.$('#9').removeClass('ui-btn-active');
	        this.$('#0').removeClass('ui-btn-active');
	        this.$('#cancel').removeClass('ui-btn-active');
	        this.$('#backspace').removeClass('ui-btn-active');
	        
	        return this;
	    },
	    
	    /*
	     * Event for when the clicks any of the number keys
	     */
	    keyClicked: function (ev) {   	 
	    	// Get key
	    	var key = $(ev.currentTarget).data('key');
	    	console.log("key = " + key);
	    	
	    	var passcode = this.model.get("Passcode");
			passcode += key;
			
			this.model.set("Passcode", passcode);
	    },
	    
	    
	    /*
	     * Event for when the user clicks the cancel key
	     */
	    cancel: function () {
	    	// nav home
	    	this.trigger("cancel");
	    },
	    
	    /*
	     * Event for when the clicks the X backspace key
	     */
	    backspace: function () {
	    	// remove last one
	    	var passcode = this.model.get("Passcode");
	    	if (passcode > 0) {
				passcode = passcode.substring(0, passcode.length - 1);
			
				this.model.set("Passcode", passcode);
			}
	    },
	});
});