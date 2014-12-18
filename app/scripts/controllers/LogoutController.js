angular.module('mobbr-lightbox.controllers')
    .controller('LogoutController', function (MobbrUser, $state, $scope) {
        'use strict';

        $scope.logout();

    });