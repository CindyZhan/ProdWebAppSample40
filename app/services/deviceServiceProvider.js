
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
var module = angular.module("IoTApp");
 /* Register this service with Angular Module*/
module.service('deviceService' ,['$http','APP_CONSTANT',  '$q',

function($http,APP_CONSTANT,$q){
    
    this.getDeviceMeta = function(token){
                var defer = $q.defer();
                var service_url = APP_CONSTANT.WEB_URL;
                var device_id = APP_CONSTANT.DEVICE_UUID;
                  // Construct the URL for our REST call and actually make the call to the WebAPI.
                var url = service_url + "/api/v1/devices/" + device_id ;
                $http({
                    method: 'GET',
                    url: url,
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                }).then(function(response) {
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
                                         // The WebAPI returned valid data
                                            // Store the returned values
                                            // Note that we currently only store name, lname, software and id
                                          
                        var result = response.data;
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
        getDeviceMeta : this.getDeviceMeta
    }
}]);


