angular.module('mobbr-lightbox.controllers')
    .controller('PaymentController', function ($scope, $rootScope, $location, $state, $timeout, $window, MobbrPayment, MobbrPerson, MobbrBalance, MobbrUri, MobbrUser, mobbrSession) {
        'use strict';

        $scope.form = {};
        $scope.loginform = {};
        $scope.formHolder = {};

        function handleMessage(response) {

            var message;

            message = response.data && response.data.message || response.message;

            if (message) {
                $rootScope.message = message;
                $timeout(function () {
                    $rootScope.message = null;
                }, 3000);
            }
        }

        var url = $rootScope.script || window.atob($state.params.hash);
        $scope.taskUrl = $state.params.hash;

        $scope.task = MobbrUri.info({ url: url, base_currency: mobbrSession.isAuthorized() && $scope.$mobbrStorage.user.currency_iso || 'EUR' }, function (response) {

            if (response.result.script && response.result.script.url && response.result.script.url !== url) {
                $scope.query = response.result.script.url;
                url = $scope.query;
            }

            if (url !== window.parent.document.location.href) {
                $scope.showTitle = true;
            }

            $scope.url = url;
            $scope.taskUrl = $window.btoa(url);
        }, handleMessage);


        function confirm(hash) {
            $scope.confirmLoading = MobbrPayment.confirm({hash: hash}, function (response) {

                if (response.result && response.result.payment_id) {
                    handleMessage(response);
                    $scope.amount = null;
                    $state.go('payment.payments');
                }
            }, function (response) {
                if (response.result && response.result.payment_id) {
                    handleMessage(response);
                }
            });
        }

        $scope.preview = function (showPreview, callBack) {
            $scope.showPreview = showPreview;
            var currency = $scope.currency && $scope.currency.currency_iso || $scope.currency;
            if ($scope.amount && currency) {
                $scope.previewLoading = MobbrPayment.preview({
                    data: $rootScope.script && JSON.stringify($rootScope.script) || $scope.url,
                    currency: currency,
                    amount: $scope.amount,
                    invoiced: $scope.wantInvoices
                }, function (response) {
                    if (callBack) {
                        callBack(response.result.hash);
                    }
                    $scope.previewScript = response.result.script;
                }, handleMessage);
            }
        }

        function perform() {
            $scope.preview(false, confirm);
        }

        $scope.performPayment = function () {
            $scope.performing = true;
            if ($scope.formHolder.pledgeForm && $scope.formHolder.pledgeForm.$valid) {
                //if (mobbrSession.isAuthorized()) {
                    perform();
                //} else {
                //    $scope.authenticating = MobbrUser.passwordLogin({ username: $scope.loginform.username, password: $scope.loginform.password }, function () {
                //        perform();
                //    }, handleMessage);
               // }
            }
        };

    });