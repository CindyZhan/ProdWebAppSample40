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


var module = angular.module("IoTApp");
 /* Register this service with Angular Module*/
module.service('realtimeService' ,['$http','APP_CONSTANT',  '$q',

function($http,APP_CONSTANT,$q){

    this.getRealTimeData = function(channels,token){
           var defer = $q.defer();
            var realtimeData = new Array();
             var tag = channels.toString();
                var service_url = APP_CONSTANT.WEB_URL;
                var device_id = APP_CONSTANT.DEVICE_UUID;
                  // Construct the URL for our REST call and actually make the call to the WebAPI.
                var url = service_url + "/api/v1/devices/" + device_id + "/timeseries/latest";
                $http({
                    method: 'GET',
                    url: url,
                     params: {
                    tags: tag
                    },
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                }).then(function(response) {
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
                                // The WebAPI returned valid data
                                            // Store the returned values
                                            // Note that we currently only store name, lname, software and id
                                          
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
                            defer.resolve(realtimeData);     
                        }
                    },
                    function(error) {
                        var message = 'ERROR_CONNECTION  : ' + service_url;
                        if (error.status === 500) {
                            message = "Error while retreiving RealTime data";
                        } else if (error.status === 400) {
                            message = "Bad Request input";
                        } else if (error.status === 401) {
                            message = error.statusText;
                        }
                        defer.reject(message);
                    });
                return defer.promise;
    }
    return{
        getRealTimeData:this.getRealTimeData
    }

}]);