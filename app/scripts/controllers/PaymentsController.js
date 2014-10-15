angular.module('mobbr-lightbox.controllers')
    .controller('PaymentsController', function ($scope, $state, $window, MobbrPayment) {
        'use strict';

        $scope.payments = MobbrPayment.uri({ url: $window.atob($state.params.hash) });

    });