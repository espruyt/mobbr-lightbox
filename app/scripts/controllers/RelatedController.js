angular.module('mobbr-lightbox.controllers')
    .controller('RelatedController', function ($scope, $rootScope, mobbrSession, MobbrUri) {
        'use strict';

        $scope.relatedTasks = MobbrUri.get({
            keywords: $scope.task.result.metadata.keywords,
            base_currency: mobbrSession.isAuthorized() && $scope.$mobbrStorage.user.currency_iso || 'EUR'
        }, function (response) {
            //console.log(response);
        }, $rootScope.handleMessage);

    })
;