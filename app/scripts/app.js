'use strict';

angular.module('mobbr-lightbox.controllers', ['mobbrApi','mobbrSession','mobbr-lightbox.config']);
angular.module('mobbr-lightbox.directives', []);
angular.module('mobbr-lightbox.filters', ['mobbrSession','mobbr-lightbox.config']);
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

]).config(function ($routeProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginController'
            })
            .when('/hash/:hash', {
                templateUrl: 'views/payment.html',
                controller: 'PaymentController'
            })
            .when('/logout', {
                controller: 'LogoutController',
                templateUrl: 'views/logout.html'
            })
            .when('/error/:error', {
                controller: 'ErrorController',
                templateUrl: 'views/error.html'
            })
            .otherwise({
                redirectTo: '/error/nohash'
            });

    }).run(function ($http, $rootScope, $route, $location, $window, MobbrApi, MobbrUser, environment, mobbrSession, MobbrBalance) {

            if (mobbrSession.isAuthorized()) {
                MobbrBalance.get(function (response) {
                    $rootScope.userCurrencies = response.result.balances;
                    if($rootScope.userCurrencies && $rootScope.userCurrencies[0]) {
                        $rootScope.currency = $rootScope.userCurrencies[0].currency_iso;
                    }
                });
            } else {
                $rootScope.currency = 'EUR';
            }

            $rootScope.mobbrSession = mobbrSession;

            $rootScope.logout = function () {
                MobbrUser.logout();
            };

            $rootScope.$on('mobbrApi:authchange', function (e, user) {
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