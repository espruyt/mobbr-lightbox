angular.module('mobbr-lightbox.controllers')
    .controller('ErrorController', function ($scope, $routeParams) {
        'use strict';

        $scope.errormessage = $routeParams.error;

    });