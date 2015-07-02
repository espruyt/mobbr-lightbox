angular.module('mobbr-lightbox.controllers')
    .controller('ReceiversController', function ($scope, $window, $state, MobbrPerson, mobbrSession) {
        'use strict';

        $scope.receivers = MobbrPerson.uri({
            url: $window.atob($state.params.hash),
            base_currency: mobbrSession.isAuthorized() && $scope.$mobbrStorage.user.currency_iso || 'EUR'
        });

    });