'use strict';
var IoTApp;
(function (IoTApp) {
    var Services;
    (function (Services) {
        /**
        * Class that makes the actual calls to the IoT platform's WebAPI to retrieve channel data for a device.
        *
        * The RESTful call makes a request to:  <WEB_URL>/api/v1/devices/{id}/channels
        * WEB_URL is an application constant that points to the base url of the WebAPI. id is the UUID that represents your device.
        *
        * The typical response from the WebAPI takes the form:
        *    channels{
        *               [ "tag": "35",
        *               "lname": "Current Phase A",
        *               "sname": "la",
        *               "aname": "la",
        *               "vtype": "INT64",
        *               ],
        *               [..],
        *               [..]
        *    }
        **/
        var ChannelServiceProvider = (function () {
            function ChannelServiceProvider() {
                this.$get = ['$http', 'APP_CONSTANT', function ($http, appConstant) {
                        return {
                            getChannelMeta: function (Callback_) {
                                try {
                                    // Create an instance of IChannelMeta 
                                    var channelMeta = {};
                                    // Construct the URL for our REST call and actually make the call to the WebAPI.
                                    var url = appConstant.WEB_URL + "/api/v1/devices/" + appConstant.DEVICE_UUID + "/channels";
                                    $http({
                                        method: 'GET',
                                        url: url,
                                        params: {}
                                    }).then(function successCallback(response) {
                                        /**
                                         * The response.data will be in JSON format similar to:
                                         *       channels {
                                         *               [0]:Object
                                         *               {
                                         *                   tag : '1002',
                                         *                   sname: 'current',
                                         *                   lname : 'current L'
                                         *               },
                                         *               .
                                         *              .
                                         *              [12]:Object
                                         *        }
                                         *
                                         **/
                                        if (response.data !== undefined) {
                                            // The WebAPI returned valid data
                                            var result = response.data.channels;
                                            for (var i = 0; i < result.length; i++)
                                                channelMeta[result[i].tag] = result[i].lname;
                                            // Call the callback routine with the data and an empty error indicating success.
                                            Callback_(channelMeta, "");
                                        }
                                        else {
                                            // Call the callback routine indicating that no data was returned.
                                            Callback_(channelMeta, "Response: 204, No Content");
                                        }
                                    }, function errorCallback(response) {
                                        // Call the callback routine with an error message
                                        var message = 'ERROR_CONNECTION  : ' + appConstant.WEB_URL;
                                        if (response.data !== null)
                                            message = response.data.Message;
                                        Callback_(channelMeta, message);
                                    });
                                }
                                catch (e) {
                                    throw Error('Exception Occurs while Calling Service ' + e.message);
                                }
                            },
                        };
                    }];
            }
            return ChannelServiceProvider;
        }());
        Services.ChannelServiceProvider = ChannelServiceProvider;
        /* Register this service with Angular Module*/
        angular.module("IoTApp").provider("IoTApp.Services.ChannelServiceProvider", ChannelServiceProvider);
    })(Services = IoTApp.Services || (IoTApp.Services = {}));
})(IoTApp || (IoTApp = {}));
//# sourceMappingURL=channelServiceProvider.js.map