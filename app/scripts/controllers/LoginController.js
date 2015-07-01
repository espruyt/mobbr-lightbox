angular.module('mobbr-lightbox.controllers')
    .controller('LoginController', function ($scope, $rootScope, MobbrUser, $state, $timeout) {
        'use strict';

        $scope.login = function (username, password) {
            $scope.authenticating = MobbrUser.passwordLogin({ username: username, password: password }).$promise.then(function () {
                if ($state.is('payment.login')) $state.go('payment');
            }, function (response) {
                $rootScope.handleMessage(response);
                $scope.authenticating = false;
            });
        };
    });