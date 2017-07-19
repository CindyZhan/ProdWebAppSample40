
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
var module = angular.module("IoTApp");
 /* Register this service with Angular Module*/
module.service('channelService' ,['$http','APP_CONSTANT',  '$q',

function($http,APP_CONSTANT,$q){

    var channelService = this;
    var channelMeta = [];

    this.invokeChannelService = function(token){
                 var defer = $q.defer();
                var service_url = APP_CONSTANT.WEB_URL;
                var device_id = APP_CONSTANT.DEVICE_UUID;
                  // Construct the URL for our REST call and actually make the call to the WebAPI.
                var url = service_url + "/api/v1/devices/" + device_id + "/channels";
                $http({
                    method: 'GET',
                    url: url,
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                }).then(function(response) {
                     // The WebAPI returned valid data
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

                        var result = response.data.channels;
                          
                        defer.resolve(result);
                    },
                    function(error) {
                        var message = 'ERROR_CONNECTION  : ' + service_url;
                        if (error.status === 500) {
                            message = "Error while retreiving Channels";
                        } else if (error.status === 400) {
                            message = "Bad Request input";
                        } else if (error.status === 401) {
                            message = error.statusText;
                        }
                        defer.reject(message);
                    });
                return defer.promise;
    }

    return {
        invokeChannelService : this.invokeChannelService
    }

}]);


