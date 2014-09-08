angular.module('mobbr-lightbox.controllers')
    .controller('ReceiversController', function ($scope, $window, $state, MobbrPerson) {
        'use strict';

        $scope.receivers = MobbrPerson.uri({ url: $window.atob($state.params.hash) });

    });