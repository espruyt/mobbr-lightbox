angular.module('mobbr-lightbox.controllers')
    .controller('ErrorController', function ($scope, $stateParams) {
        'use strict';

        $scope.errormessage = $stateParams.error;

    });