var IoTApp;
(function (IoTApp) {
    var Services;
    (function (Services) {
        /**
         * Class that makes the actual calls to the IoT platform's WebAPI to retrieve metadata for a device.
         *
         * The RESTful call makes a request to:  <WEB_URL>/api/v1/devices/{id}
         * WEB_URL is an application constant that points to the base url of the WebAPI. id is the UUID that represents your device.
         *
         * The typical response from the WebAPI takes the form:
         *          {
         *              "id": "e0824ba4-d832-49d6-ab60-6212a63bcd10",
         *               "profile_id": "72358726-1ed0-485b-8beb-6a27a27b58e8",
         *               "name": "My 9390 UPS",
         *               "serial": "MySerial",
         *               "asset": "MyAsset",
         *               "mac": "00:0a:95:9d:61:19",
         *               "vendor": "Eaton",
         *               .
         *               .
         *           }
         **/
        var DeviceServiceProvider = (function () {
            function DeviceServiceProvider() {
                this.$get = ['$http', 'APP_CONSTANT', function ($http, appConstant) {
                        return {
                            getDeviceMeta: function (Callback_) {
                                try {
                                    // Create an instance of IDeviceMeta 
                                    var deviceMeta = new Array();
                                    // Construct the URL for our REST call and actually make the call to the WebAPI.
                                    var url = appConstant.WEB_URL + "/api/v1/devices/" + appConstant.DEVICE_UUID;
                                    $http({
                                        method: 'GET',
                                        url: url,
                                        params: {}
                                    }).then(function successCallback(response) {
                                        /**
                                        * The response.data will be in JSON format similar to:
                                        *          {
                                        *              "id": "e0824ba4-d832-49d6-ab60-6212a63bcd10",
                                        *               "profile_id": "72358726-1ed0-485b-8beb-6a27a27b58e8",
                                        *               "name": "My 9390 UPS",
                                        *               "serial": "MySerial",
                                        *               "asset": "MyAsset",
                                        *               "mac": "00:0a:95:9d:61:19",
                                        *               "vendor": "Eaton",
                                        *               .
                                        *               .
                                        *           }
                                        *
                                        **/
                                        if (response.data !== undefined) {
                                            // The WebAPI returned valid data
                                            // Store the returned values
                                            // Note that we currently only store name, lname, software and id
                                            deviceMeta.push({ model_lname: response.data.model_lname, name: response.data.name, id: response.data.id, software: response.data.software });
                                            // Call the callback routine with the data and an empty error indicating success.
                                            Callback_(deviceMeta, "");
                                        }
                                        else {
                                            // Call the callback routine indicating that no data was returned.
                                            Callback_(deviceMeta, "Response: 204, No Content");
                                        }
                                    }, function errorCallback(response) {
                                        var message = 'ERROR_CONNECTION : ' + appConstant.WEB_URL;
                                        if (response.data !== null)
                                            message = response.data.Message;
                                        // Call the callback routine with an error message
                                        Callback_(deviceMeta, message);
                                    });
                                }
                                catch (e) {
                                    throw Error('Exception Occurs while Calling Service ' + e.message);
                                }
                            },
                        };
                    }];
            }
            return DeviceServiceProvider;
        }());
        Services.DeviceServiceProvider = DeviceServiceProvider;
        /*Register service To Angular Module */
        angular.module("IoTApp").provider("IoTApp.Services.DeviceServiceProvider", DeviceServiceProvider);
    })(Services = IoTApp.Services || (IoTApp.Services = {}));
})(IoTApp || (IoTApp = {}));