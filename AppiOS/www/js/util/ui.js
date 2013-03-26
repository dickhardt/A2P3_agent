/* 
* Copyright (C) Province of British Columbia, 2013
*/

$("input").change(function() {
  var inputs = $(this).closest('form').find(':input');
  inputs.eq( inputs.index(this)+ 1 ).focus();
});