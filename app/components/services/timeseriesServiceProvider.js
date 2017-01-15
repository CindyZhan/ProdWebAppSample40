var IoTApp;
(function (IoTApp) {
    var Services;
    (function (Services) {
        /**
         * Class that makes the actual calls to the IoT platform's WebAPI to retrieve time series data for a device.
         *
         * The RESTful call makes a request to:  <WEB_URL>/api/v1/devices/{id}/timeseries
         * WEB_URL is an application constant that points to the base url of the WebAPI. id is the UUID that represents your device.
         * The start and end date and the channel are passed as parameters to the call.
         *
         * The typical response from the WebAPI takes the form:
         *          {
         *               time :  '2345456565',
         *               value : '2'
         *          }
         **/
        var TimeSeriesServiceProvider = (function () {
            function TimeSeriesServiceProvider() {
                this.$get = ['$http', 'APP_CONSTANT', function ($http, appConstant) {
                        return {
                            getTimeSeriesData: function (startDate, endDate, channel, trait, Callback_) {
                                try {
                                    // Create an instance of ITimeSeriesData 
                                    var timeseriesData = new Array();
                                    // Construct the URL for our REST call and actually make the call to the WebAPI.
                                    var url = appConstant.WEB_URL + "/api/v1/devices/" + appConstant.DEVICE_UUID + "/timeseries";
                                    $http({
                                        method: 'GET',
                                        url: url,
                                        params: {
                                            tag_trait_list: channel+trait,
                                            start: startDate,
                                            end: endDate
                                        }
                                    }).then(function successCallback(response) {
                                        if (response.data.results !== undefined) {
                                            // The WebAPI returned valid data
                                            var result = response.data.results[0];
                                            //To Do: Time conversion issue 
                                            for (var i = 0; i < result.values.length; i++) {
                                                timeseriesData.push({
                                                    time: result.values[i].t, value: result.values[i].v, channel: channel
                                                });
                                            }
                                            // Call the callback routine with the data and an empty error indicating success.
                                            Callback_(timeseriesData, "");
                                        }
                                        else {
                                            // Call the callback routine indicating that no data was returned.
                                            Callback_(timeseriesData, "Response: 204, No Content");
                                        }
                                    }, function errorCallback(response) {
                                        var message = "ERROR_CONNECTION  :  " + appConstant.WEB_URL;
                                        if (response.data !== null)
                                            message = response.data.Message;
                                        // Call the callback routine with an error message
                                        Callback_(timeseriesData, message);
                                    });
                                }
                                catch (e) {
                                    throw Error('Exception Occurs while Calling Service ' + e.message);
                                }
                            }
                        };
                    }];
            }
            return TimeSeriesServiceProvider;
        }());
        Services.TimeSeriesServiceProvider = TimeSeriesServiceProvider;
        angular.module("IoTApp").provider("IoTApp.Services.TimeSeriesServiceProvider", TimeSeriesServiceProvider);
    })(Services = IoTApp.Services || (IoTApp.Services = {}));
})(IoTApp || (IoTApp = {}));
