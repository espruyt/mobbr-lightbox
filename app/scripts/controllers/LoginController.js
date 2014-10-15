angular.module('mobbr-lightbox.controllers')
    .controller('LoginController', function ($scope, MobbrUser) {
        'use strict';

        $scope.login = function (username, password) {
            $scope.authenticating = MobbrUser.passwordLogin({ username: username, password: password }, handleMessage, handleMessage).$promise.then(function () {
                $state.go('payment');
            }, function () {
                $scope.authenticating = false;
            });
        };

        function handleMessage(response) {
            var message;
            if (response && response.data && response.data.message) {
                message = response.data.message;
            } else {
                message = response.message;
            }
            if (message) {
                if (message.type === 'error') {
                    $scope.performing = false;
                }
                $scope.message = message;
            }
        }
    });