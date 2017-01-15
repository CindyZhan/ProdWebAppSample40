var IoTApp;
(function (IoTApp) {
    var Services;
    (function (Services) {
        /**
         * Class that makes the actual calls to the IoT platform's WebAPI to sends command to a device.
         *
         * The RESTful call makes a request to:  <WEB_URL>/api/v1/Command/Command_SetChannelValue
         * WEB_URL is an application constant that points to the base url of the WebAPI. id is the UUID that represents your device.
         *
         * The typical response from the WebAPI takes the form:
         *          {
         *          }
         **/
        var CommandServiceProvider = (function () {
            function CommandServiceProvider() {
                this.$get = ['$http', 'APP_CONSTANT', function ($http, appConstant) {
                        return {
                            sendCommand: function (id, tag, command, Callback_) {
                                try {
                                    // Construct the URL for our REST call and actually make the call to the WebAPI.
                                    var url = appConstant.WEB_URL + "/api/v1/devices/" + id + "/channels/" + tag;
                                    $http({
                                        method: 'PUT',
                                        url: url,
                                        data: "{ v: '" + command + "' }"
                                     }).then(function successCallback(response) {
                                        if (response != null) {
                                            // Call the callback routine with the data and an empty error indicating success.
                                            Callback_(response, "");
                                        }
                                        /*else {
                                            // Call the callback routine indicating that no data was returned.
                                            Callback_(deviceCommandResult, "Response: 204, No Content");
                                        }*/
                                    }, function errorCallback(response) {
                                        var message = 'ERROR_CONNECTION : ' + appConstant.WEB_URL;
                                        if (response.data !== null)
                                            message = response.data.Message;
                                        // Call the callback routine with an error message
                                        Callback_(response, message);
                                    });
                                }
                                catch (e) {
                                    throw Error('Exception Occurs while Calling Service ' + e.message);
                                }
                            },
                        };
                    }];
            }
            return CommandServiceProvider;
        })();
        Services.CommandServiceProvider = CommandServiceProvider;
        /*Register service To Angular Module */
        angular.module("IoTApp").provider("IoTApp.Services.CommandServiceProvider", CommandServiceProvider);
    })(Services = IoTApp.Services || (IoTApp.Services = {}));
})(IoTApp || (IoTApp = {}));
//# sourceMappingURL=commandServiceProvider.js.map