
var module = angular.module("IoTApp");
module.service('loginService' ,['$http','APP_CONSTANT', '$cookies',  '$q', '$timeout', '$location','$window',

function ($http, APP_CONSTANT,$cookies,$q,$timeout,$location,$window){
 
        var isAuthenticatedFlag = false;
        var authService = this;
        var _token = '';

          this.getSecurityToken = function(username,password) {
             var defer = $q.defer();
            var token ;
            var service_url = APP_CONSTANT.WEB_URL;
            var url = service_url + "/api/v1/security/token";
            var appId = APP_CONSTANT.APP_ID;
            $http({
                method: 'POST',
                url: url,
                data: {
                    user: username,
                    password: password,
                    applicationId: appId
                }

            }).then(function(response) {
                    if(response!== undefined){
                    token = response.data.Token;
                    }
                    defer.resolve(token);

                },
                function(error) {
                    var message = 'Connection Failure: ' + service_url;
                    if (error.data !== null)
                        message = error.statusText;
                    defer.reject(message);
                });
            return defer.promise;    
        };


        /*
         Fetch Token using SecurityService
        */
        this.createSession = function(username, password) {
                var defer = $q.defer();
                authService.getSecurityToken(username, password).then(function(token) {
                    authService._token = token;
                    var sessionPeriod = authService.processToken(token);
                    //Return if we have invalid session time
                    if (sessionPeriod < 0) {
                        defer.reject(authService.isAuthenticatedFlag);
                        return;
                    }
                    authService.setTimeOut(sessionPeriod);
                    authService.isAuthenticatedFlag = true;
                    $cookies.put('securityToken', token);
                    $cookies.put('email', username);
                    $cookies.put('isAuthenticated', true);
                    defer.resolve(authService.isAuthenticatedFlag);
                }, function(error) {
                    defer.reject(error);
                });
                return defer.promise;
            },
            /*
            Remove all cookies once its invalid.
            */
            this.removeSession = function() {
                authService.isAuthenticatedFlag = false;
                $cookies.remove('securityToken');
                $cookies.remove('username');
                $cookies.remove('email');
                $cookies.remove('isAuthenticated');
            },

	   this.logout = function(){
		 authService.removeSession();
		 $location.path('/login');
	  },

            /**
             * Parse JWT token to get username, exp time 
             * 
             */
            this.processToken = function(token) {
                try {
                    var parts = token.split('.');
                    var decoded = authService.urlBase64Decode(parts[1]);
                    var _decoded = angular.fromJson(decoded);
                    if (typeof _decoded.exp === "undefined") {
                        return -1;
                    }
                    if (typeof _decoded.name !== "undefined") {
                        $cookies.put('username', _decoded.name);
                    }
                    var d = new Date(0); // The 0 here is the key, which sets the date to the epoch
                    d.setUTCSeconds(_decoded.exp);
                    var _epochTime = d.getTime();

                    var defaultDate = new Date();
                    var _defaultTime = defaultDate.getTime();
                    var diff = _epochTime - _defaultTime;
                    return diff
                } catch (e) {
                    return -1;
                }

            },
            //Decode token 
            this.urlBase64Decode = function(str) {
                var output = str.replace(/-/g, '+').replace(/_/g, '/');
                switch (output.length % 4) {
                    case 0:
                        {
                            break;
                        }
                    case 2:
                        {
                            output += '==';
                            break;
                        }
                    case 3:
                        {
                            output += '=';
                            break;
                        }
                    default:
                        {
                            throw 'Illegal base64url string!';
                        }
                }
                return $window.decodeURIComponent(escape($window.atob(output))); //polyfill https://github.com/davidchambers/Base64.js
            },

            /*
            Authentication Status
            */
            this.isAuthenticated = function() {
                return $cookies.get('isAuthenticated');
            },
            /*
            TimeOut period is for 1 hour as default
            It's not secure to store username & passwords into Browsers Cookie, so
            after a token has expired, it will prompt for credentials.
            */
            this.setTimeOut = function(period) {
                $timeout(function() {
                    authService.removeSession();
                    //var pageName = APP_CONSTANT.LOGIN_ROUTE_NAME;
                    $location.path('/login');
                }, period);
            },

            /*
             Logged in user name
            */
            this.getUserName = function() {
                return $cookies.get("username");
            }
            /*
            Get JWT Authentication token
            */
        this.getToken = function() {
                return $cookies.get("securityToken");
            }
            /*
            Get user email 
            */
        this.getEmail = function() {
                return $cookies.get("email");
            }
            /*
            Returns status of  token expiration
            */
        this.isTokenExpired = function() {
            var token = $cookies.get("securityToken");
            var period = authService.processToken(token);
            if (period < 0) {
                return true;
            }
            return false;
        }

         this.validateToken = function() {
            var isValid = false;
            var token = authService.getToken();
            var isExpired = authService.isTokenExpired();
            if (!isExpired && token !== undefined) {
                isValid = true;
            }else{
              
                isValid = false;
            }
            return isValid;
        }

        this.isAuthenticated = function(){
            var isValid = authService.validateToken();
            if (!isValid) {
               $location.path('/login');
               return false;
            }
            return true;
        }

        /*
        Public methods available to all
        */
        return {
            createSession: this.createSession,
            removeSession: this.removeSession,
            isAuthenticated: this.isAuthenticated,
            getUserName: this.getUserName,
            setTimeOut: this.setTimeOut,
            getToken: this.getToken,
            processToken: this.processToken,
            urlBase64Decode: this.urlBase64Decode,
            isTokenExpired: this.isTokenExpired,
            getEmail: this.getEmail,
            getSecurityToken:this.getSecurityToken,
            validateToken:this.validateToken,
            isAuthenticated:this.isAuthenticated,
	    logout:this.logout
        };


}]);
