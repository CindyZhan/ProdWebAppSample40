(
  function ()
  {
  	window.addEventListener("WebComponentsReady", function(e) {
  	// imports are loaded and elements have been registered
  	angular.element(document).ready(function() {
  		angular.bootstrap(document, ["IoTApp"]);
  	});
  });
  var app = angular.module("IoTApp", ['ngRoute', 'ng-polymer-elements', 'ngCookies', 'LocalStorageModule', 'rzModule']);
    app.config(IoTApp.Routes.configureRoutes);
    /*
    Constant Module available  across controllers and services
    */
    app.constant('APP_CONSTANT', {
        DEVICE_UUID:  '3386409b-9874-5f9e-844f-34b0d36c155b',
        CHANNEL_META: [{
            tag:'616',lname:'Power Factor Apparent'
        },{
             tag:'163',lname:'Voltage(L-L) Phase AB'
        },{
             tag:'41',lname:'Current Phase A'
        },{
             tag:'888',lname:'Real Power Phase A'
        },{
             tag:'596',lname:'Percent of Full Load'
        }],
        WEB_URL: 'https://prodiotwebapi.eaton.com',
        APP_ID:'b3dfadc4-2002-46a5-96ce-a6b4a6720613',
        REAL_TIME_REFRESH: 5000,
        SLIDER_CHANNEL_TAG: "596",
        COMMAND_CHANNEL: "12286"
    });
   
    var channlMeta={};

})();
