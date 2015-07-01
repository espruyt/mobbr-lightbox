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
            .state('main', {
                url: '/'
            })
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
            .state('login', {
                url: '/login',
                templateUrl: 'views/login.html',
                controller: 'LoginController'
            })
            .state('logout', {
                url: '/logout',
                controller: 'LogoutController'
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
            .state('payment.logout', {
                url: '/logout',
                controller: 'LogoutController'
            })
            .state('error', {
                url: '/error/:error',
                controller: 'ErrorController',
                templateUrl: 'views/error.html'
            });

        $urlRouterProvider.otherwise('/');

    }).run(function ($http, $rootScope, $state, $timeout, $location, $window, MobbrApi, MobbrUser, environment, mobbrSession, MobbrBalance, uiUrl, filterFilter) {

            $rootScope.mobbrSession = mobbrSession;
            $rootScope.$state = $state;
            $rootScope.uiUrl = uiUrl;

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams,fromState) {
            if (!(toState.name === 'main' && (!fromState || fromState.url === '^'))) {
                $window.ga('send', 'pageview', { page: $location.path() });
            }
        });

        $rootScope.handleMessage = function (response) {

            var message;

            message = response.data && response.data.message || response.message;

            if (message) {
                $rootScope.message = message;
                $rootScope.message.type = response.status[0] === 2 ? 'success' : 'danger';
                $timeout(function () {
                    $rootScope.message = null;
                }, 3000);
            }
        };

        function setCurrencies() {
            if (mobbrSession.isAuthorized()) {
                MobbrBalance.get(function (response) {
                    $rootScope.userCurrencies = response.result.balances;
                });
            } else {
                $rootScope.userCurrencies = $rootScope.networkCurrencies;
            }
        }

        function listener(event) {
            if ((!event || !event.data || !event.data.url) || (event && event.data && event.data.url && event.data.url.indexOf(event.origin) === -1)) {
                return;
            } else {
                $rootScope.script = event.data;
            }
        }

        if (window.addEventListener){
            addEventListener('message', listener, false)
        } else {
            attachEvent('onmessage', listener)
        }

        $rootScope.logout = function () {
            MobbrUser.logout().$promise.then(function () {
                if ($state.includes('payment')) {
                    $state.go('payment.login');
                } else {
                    $state.go('login');
                }

            });
        };

        $rootScope.encodeTask = function (url) {
            return $window.btoa(url);
        };


        $rootScope.$on('mobbrApi:authchange', function (e, user) {
            if ($window.parent && $window.parent.postMessage) {
                $window.parent.postMessage(user && [ user.username, user.email ].join('|') || 'logout', '*');
            }
        });

        $rootScope.currencies = MobbrApi.currencies(function (response) {
            $rootScope.networkCurrencies = filterFilter($rootScope.currencies.result, { wallet_support: true });
            response.result.forEach(function (item) {
                $rootScope.currenciesMap[item.currency_iso] = item;
            });
            setCurrencies();
        });

        $rootScope.getLanguage = function () {
            return $rootScope.$mobbrStorage.user && $rootScope.$mobbrStorage.user.language_iso || ($window.navigator.userLanguage || $window.navigator.language).toUpperCase();
        }

        $rootScope.$on('mobbrApi:authchange', setCurrencies);

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