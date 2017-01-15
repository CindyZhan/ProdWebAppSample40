'use strict';

/**
 * This file demonstrates the preferred method for authentication using Azure's Active Directory platform.
 *
 * The Azure Active Directory Library for JavaScript is used for authentication.
 *      https://github.com/AzureAD/azure-activedirectory-library-for-js
 *
 */

angular.module('IoTApp')
.controller('loginController', ['$scope','$timeout', 'adalAuthenticationService', 'localStorageService', 'APP_CONSTANT', function ($scope,$timeout, adalService, localStorageService, APP_CONSTANT) {

    /**
     * Angular's localStorage is used to store login information.
     *
     * At startup or when the user is not authenticated the value contained in username is '' (empty string) and the value contained in action is 'Login'
     * Once the user has authenticated by logging in username will contain their name (ie ProdBBUser1@gmail.com) and action will contain 'LogOut'
     *
     **/
    var controller = this;
    $scope.username = localStorage.getItem("username");
    $scope.action = localStorage.getItem("action");
    controller.status = adalService.userInfo.isAuthenticated;

    /**
     * Function called when page first opens.
     *
     * When the page first load check the Azure Active Directory Service to see whether the user is authenticated.
     * If the user is not logged in then clear the values in localStorage and username. Also set action to 'Login'.
     * If the user is currently authenticated then set username to the first email in the user's profile.
     *
     * Additional Notes:
     *      Calls to the ADAL service are asynchronous. The methods are wrapped in a setTimeout call to mimic
     *      a synchronous call.
     *
     **/
    $scope.firstLoadPage = function () {
        setTimeout(function () {
            $scope.$apply(function () {
                if (!adalService.userInfo.isAuthenticated) {
                    $scope.username = '';
                    $scope.action = 'Login';
                    localStorage.clear();
                } else {
                    var profile = adalService.userInfo.profile;
                    var authorized = false;

                    angular.forEach(profile, function (value, key) {
                        if (key === APP_CONSTANT.CLAIM) {
                            authorized = value !== 'true' ? false : true;
                        }
                        if (key === 'emails') {
                            localStorage.setItem("username", value[0]);
                            $scope.username = localStorage.getItem("username");
                        }
                    });

                    if (!authorized) {
                        $scope.logout();
                        localStorage.clear();
                        localStorage.setItem("action", "Login");
                        console.log("Extension Claim is invalid in Azure authentication token");
                    }

                }
            });
        }, 1000);
        $scope.action = localStorage.getItem("action");
    }

    /**
     * Function called after the user logs in.
     * Calls login or logout based on the current value of action.
     * Updates the values of action in localStorage.
     **/
    $scope.process = function () {
        if ($scope.action === 'Login') {
            localStorage.setItem("action", "LogOut");
            $scope.login();
        } else {
            $scope.logout();
            localStorage.clear();
            localStorage.setItem("action", "Login");
        }
    }

    /**
    * Simple wrapper for the adalService login function
    **/
    $scope.login = function () {
        adalService.login();

    };

    /**
     * Simple wrapper for the adalService logOut function
     **/
    $scope.logout = function () {
        adalService.logOut();

    };

    /**
     * Callback function that logs the user off of the system after one hour of inactivity.
     * The local value for username is cleared and the action is set to 'Login'. localStorage is cleared.
     * 3600000 represents the number of ms in an hour.
     **/
    $timeout(function () {
        $scope.username = '';
        $scope.action = 'Login';
        $scope.logout();
        localStorage.clear();
    }, 3600000);
}]);
