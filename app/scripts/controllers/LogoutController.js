angular.module('mobbr-lightbox.controllers')
    .controller('LogoutController', function (MobbrUser, $state, $scope) {
        'use strict';

        //$scope.logout = function () {
            MobbrUser.logout().$promise.then(function () {
                if ($state.includes('payment')) {
                    $state.go('payment.login');
                } else {
                    $state.go('login');
                }

            });
        //};

    });