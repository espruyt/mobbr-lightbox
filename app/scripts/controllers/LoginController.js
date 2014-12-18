angular.module('mobbr-lightbox.controllers')
    .controller('LoginController', function ($scope, $rootScope, MobbrUser, $state, $timeout) {
        'use strict';

        $scope.login = function (username, password) {
            $scope.authenticating = MobbrUser.passwordLogin({ username: username, password: password }).$promise.then(function () {
                $state.go('payment');
            }, function (response) {
                handleMessage(response);
                $scope.authenticating = false;
            });
        };

        function handleMessage(response) {

            var message;

            if (response.data && response.data.message) {
                message = response.data.message;
            }
            if (message) {
                $rootScope.message = message;
                $timeout(function () {
                    $rootScope.message = null;
                }, 3000);
            }
        }
    });