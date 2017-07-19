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
var module = angular.module("IoTApp");
 /* Register this service with Angular Module*/
module.service('commandService' ,['$http','APP_CONSTANT',  '$q',

function($http,APP_CONSTANT,$q){

    this.sendCommand = function(id,tag,command,token){
                 var defer = $q.defer();
                var service_url = APP_CONSTANT.WEB_URL;
                var device_id = APP_CONSTANT.DEVICE_UUID;
                  // Construct the URL for our REST call and actually make the call to the WebAPI.
                var url = service_url + "/api/v1/devices/" + device_id  + "/channels/" + tag;
                 $http({
                                        method: 'PUT',
                                        url: url,
                                        data: { v: "\'" + command + "\'" },
                                         headers: {
                                             'Authorization': 'Bearer ' + token
                                         },
                                    }).then(function(response) {
                                        if (response != null) {
                                            // Call the callback routine with the data and an empty error indicating success.
                                            defer.resolve(response);
                                        }
                                       
                                    }, function (error) {
                                        var message = 'ERROR_CONNECTION  : ' + service_url;
                                              if (error.status === 500) {
                                          message = "Error while sending Command";
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
        sendCommand : this.sendCommand
    }

}]);