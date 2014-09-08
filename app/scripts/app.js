'use strict';

angular.module('mobbr-lightbox.controllers', ['mobbrApi','mobbrSession','mobbr-lightbox.config']);
angular.module('mobbr-lightbox.directives', []);
angular.module('mobbr-lightbox.filters', ['mobbrSession','mobbr-lightbox.config']);
angular.module('mobbr-lightbox.configuration', []);

angular.module('mobbr-lightbox', [

    'mobbrApi',
    'mobbrMsg',
    'mobbrSession',
    'angularMoment',
    'ui.router',
    'ui.bootstrap',
    'mobbr-lightbox.config',
    'mobbr-lightbox.directives',
    'mobbr-lightbox.controllers',
    'mobbr-lightbox.filters'

]).config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('payment', {
                url: '/hash/:hash',
                templateUrl: 'views/payment.html',
                controller: 'PaymentController'
            })
            .state('payment.login', {
                url: '/login',
                templateUrl: 'views/login.html',
                controller: 'LoginController'
            })
            .state('payment.payments', {
                url: '/payments',
                templateUrl: 'views/payments.html',
                controller: 'PaymentsController'
            })
            .state('payment.receivers', {
                url: '/receivers',
                templateUrl: 'views/receivers.html',
                controller: 'ReceiversController'
            })
            .state('logout', {
                url: '/logout',
                controller: 'LogoutController',
                templateUrl: 'views/logout.html'
            })
            .state('error', {
                url: '/error/:error',
                controller: 'ErrorController',
                templateUrl: 'views/error.html'
            });

        $urlRouterProvider.otherwise('/error/nohash');

    }).run(function ($http, $rootScope, $state, $location, $window, MobbrApi, MobbrUser, environment, mobbrSession, MobbrBalance, uiUrl) {

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
            $rootScope.$state = $state;
            $rootScope.uiUrl = uiUrl;

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