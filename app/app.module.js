(
  function ()
  {
  	window.addEventListener("WebComponentsReady", function(e) {
  	// imports are loaded and elements have been registered
  	angular.element(document).ready(function() {
  		angular.bootstrap(document, ["IoTApp"]);
  	});
  });
  var app = angular.module("IoTApp", ['ngRoute', 'ng-polymer-elements', 'AdalAngular', 'LocalStorageModule', 'rzModule']);
    app.config(IoTApp.Routes.configureRoutes);
    /*
    Constant Module available  across controllers and services
    */
    app.constant('APP_CONSTANT', {
        AZURE_AD_URL: 'https://login.microsoftonline.com/',
        AZURE_TENANT_ID: 'ProdEatonIoT.onmicrosoft.com',
        AZURE_CLIENT_ID: 'bafd8195-74f1-4d62-94c1-2a5e224dd5a6',
        DEVICE_UUID: '3386409b-9874-5f9e-844f-34b0d36c155b',
        CHANNEL_META: (channelMeta = {},
			channelMeta["616"] = "Power Factor Apparent",
            channelMeta["163"] = "Voltage(L-L) Phase AB",
            channelMeta["41"] = "Current Phase A",
            channelMeta["888"] = "Real Power Phase A",
            channelMeta["596"] = "Percent of Full Load",
            channelMeta
        ),
        WEB_URL: 'https://prodiotwebapi.cloudapp.net',
        REAL_TIME_REFRESH: 2000,
        SYNC_DELAY: 2000,
       CLAIM:  'extension_Eaton_Claim_BBB28',
        SLIDER_CHANNEL_TAG: "596",
        COMMAND_CHANNEL: "12286",
		TRAIT: ".avg"
    });
    /*
    Initializes the ADAL JS module with Azure parameters
    Stores all token in localStorage
    extraQueryParameter is for B2C version
    */
    app.config(['$httpProvider', 'adalAuthenticationServiceProvider', 'APP_CONSTANT', 'localStorageServiceProvider', function ($httpProvider, adalProvider, APP_CONSTANT, localStorageService) {
            adalProvider.init({
                instance: APP_CONSTANT.AZURE_AD_URL,
                tenant: APP_CONSTANT.AZURE_TENANT_ID,
                clientId: APP_CONSTANT.AZURE_CLIENT_ID,
                extraQueryParameter: 'p=B2C_1_ProdIoTWebApp28_Signin_Policy&scope=openid&nux=1',
                cacheLocation: 'localStorage',
            }, $httpProvider);
        }]);
    var channlMeta={};

})();
