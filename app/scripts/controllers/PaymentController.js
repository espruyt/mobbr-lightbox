angular.module('mobbr-lightbox.controllers')
    .controller('PaymentController', function ($scope, $rootScope, $location, $state, $timeout, $window, MobbrPayment, MobbrPerson, MobbrBalance, MobbrUri, MobbrUser, mobbrSession, uiUrl) {
        'use strict';

        $scope.form = {};
        $scope.loginform = {};
        $scope.formHolder = {};

        var url = $rootScope.script || window.atob($state.params.hash);
        $scope.taskUrl = $state.params.hash;

        $scope.task = MobbrUri.info({ url: url, base_currency: mobbrSession.isAuthorized() && $scope.$mobbrStorage.user.currency_iso || 'EUR' }, function (response) {

            if (response.result.script && response.result.script.url && response.result.script.url !== url) {
                $scope.query = response.result.script.url;
                url = $scope.query;
            }

            if (!response.result.script) {
                $scope.noScript = true;
            }

            if (url !== window.document.referrer) {
                $scope.showTitle = true;
            }

            $scope.relatedTasks = MobbrUri.get({
                keywords: response.result.metadata.keywords,
                base_currency: mobbrSession.isAuthorized() && $scope.$mobbrStorage.user.currency_iso || 'EUR'
            }, function (response) {
                //console.log(response);
            }, $rootScope.handleMessage);

            $scope.url = url;
            $scope.taskUrl = $window.btoa(url);
        }, $rootScope.handleMessage);


        function confirm(hash) {
            $scope.confirmLoading = MobbrPayment.confirm({hash: hash}, function (response) {
                if (response.result && response.result.payment_id) {
                    $rootScope.handleMessage(response);
                    $scope.amount = null;
                    $state.go('payment.payments');
                }
            }, function (response) {
                $rootScope.handleMessage(response);
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
                }, $rootScope.handleMessage);
            }
        };

        function perform() {
            $scope.preview(false, confirm);
        }

        $scope.performPayment = function () {
            $scope.performing = true;
            if ($scope.formHolder.pledgeForm && $scope.formHolder.pledgeForm.$valid) {
                perform();
            }
        };

        $scope.uiUrl = uiUrl;

    });