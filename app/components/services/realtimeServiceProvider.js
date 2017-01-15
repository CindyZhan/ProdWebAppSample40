var IoTApp;
(function (IoTApp) {
    var Services;
    (function (Services) {
        /**
         * Class that makes the actual calls to the IoT platform's WebAPI to retrieve realtime data for a device.
         *
         * The RESTful call makes a request to:  <WEB_URL>/api/v1/devices/{id}/timeseries/latest?tags={}
         * WEB_URL is an application constant that points to the base url of the WebAPI. id is the UUID that represents your device.
         * tags represents the list of channels for which you would like to receive realtime data.
         *
         * The typical response from the WebAPI takes the form:
         *     {tag:'1001',value:'12.12',time:'12354654'}
         **/
        var RealtimeServiceProvider = (function () {
            function RealtimeServiceProvider() {
                this.$get = ['$http', 'APP_CONSTANT', function ($http, appConstant) {
                        return {
                            getRealtimeData: function (channels, Callback_) {
                                try {
                                    // Create an instance of IRealtimeData
                                    var realtimeData = new Array();
                                    var tag = channels.toString();
                                    // Construct the URL for our REST call and actually make the call to the WebAPI.
                                    var url = appConstant.WEB_URL + "/api/v1/devices/" + appConstant.DEVICE_UUID + "/timeseries/latest";
                                    $http({
                                        method: 'GET',
                                        url: url,
                                        params: {
                                            tags: tag
                                        }
                                    }).then(function successCallback(response) {
                                        /**
                                         * The response.data will be in JSON format similar to:
                                         *       results {
                                         *                   [0]:Object
                                         *                   {
                                         *                       tag:'1001',
                                         *                       value:'12.12',
                                         *                       time:'12354654'
                                         *                   },
                                         *                   .
                                         *                   .
                                         *                   [x]:Object {...}
                                         *
                                         **/
                                        if (response.data.results !== undefined) {
                                            // The WebAPI returned valid data
                                            var result = response.data.results;
                                            var value = '-';
                                            var timeString = '-';
                                            for (var i = 0; i < result.length; i++) {
                                                if (result[i].value !== undefined)
                                                    value = result[i].value;
                                                if (result[i].time !== undefined && parseInt(result[i].time) !== 0)
                                                    timeString = (parseInt(result[i].time) * 1000).toString();
                                                realtimeData.push({ tag: result[i].tag, value: value, time: timeString });
                                            }
                                            // Call the callback routine with the data and an empty error indicating success.
                                            Callback_(realtimeData, "");
                                        }
                                        else {
                                            // Call the callback routine indicating that no data was returned.
                                            Callback_(realtimeData, "Response: 204, No Content");
                                        }
                                    }, function errorCallback(response) {
                                        var message = 'ERROR_CONNECTION : ' + appConstant.WEB_URL;
                                        if (response.data !== null && response.data.Message != null)  // KWK
                                            message = response.data.Message;
                                        // Call the callback routine with an error message
                                        Callback_(realtimeData, message);
                                    });
                                }
                                catch (e) {
                                    throw Error('Exception Occurs while Calling Service ' + e.message);
                                }
                            },
                        };
                    }];
            }
            return RealtimeServiceProvider;
        }());
        Services.RealtimeServiceProvider = RealtimeServiceProvider;
        /*
        Register service with AngularModule
        */
        angular.module("IoTApp").provider("IoTApp.Services.RealtimeServiceProvider", RealtimeServiceProvider);
    })(Services = IoTApp.Services || (IoTApp.Services = {}));
})(IoTApp || (IoTApp = {}));