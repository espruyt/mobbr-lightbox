'use strict';

angular.module('mobbr-lightbox.controllers', []);
angular.module('mobbr-lightbox.directives', []);
angular.module('mobbr-lightbox.filters', []);
angular.module('mobbr-lightbox.configuration', []);

angular.module('mobbr-lightbox', [

        'mobbrApi',
        'mobbrMsg',
        'mobbrSession',
        'ngRoute',
        'ui.bootstrap',
        'mobbr-lightbox.config',
        'mobbr-lightbox.directives',
        'mobbr-lightbox.controllers',
        'mobbr-lightbox.filters'

    ]).run(function ($http, $rootScope, $route, $location, $window, MobbrApi, MobbrUser, environment) {

        $rootScope.login = function (email, password) {
            MobbrUser.passwordLogin({ email: email, password: password }, function () {
                $location.path('/wallet');
            });
        };

        $rootScope.logout = function () {
            MobbrUser.logout();
        };

        $rootScope.$on('mobbrApi:authchange', function (e, user) {
            $route.reload();
            if ($window.parent && $window.parent.postMessage) {
                $window.parent.postMessage(user && [ user.username, user.email ].join('|') || 'logout', '*');
            }
        });

        $rootScope.linkUrl = function (url) {
            return '/#/url/' + window.btoa(url);
        }

        $rootScope.isTest = function () {
            return environment !== 'production';
        }

        $rootScope.currenciesMap = {};
        MobbrApi.currencies(function (response) {
            if (response.result != null) {
                $rootScope.currenciesMap = response.result;
            } else if (response.message != null) {
                console.log('error loading currencies' + response.error.status);
            }
            $rootScope.currenciesMap['MBR'] = 'Mobbr';
        });
    }
);