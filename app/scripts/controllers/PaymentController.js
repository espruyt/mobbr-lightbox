angular.module('mobbr-lightbox.controllers')
    .controller('PaymentController', function ($scope, $rootScope, $location, $state, $timeout, $window, $filter, MobbrPayment, MobbrPerson, MobbrBalance, MobbrUri, MobbrUser, mobbrSession, uiUrl, task) {
        'use strict';

        var url = $rootScope.script || window.atob($state.params.hash);

        $scope.form = {};
        $scope.loginform = {};
        $scope.formHolder = {};
        $scope.taskUrl = $state.params.hash;
        $scope.task = task;
        $rootScope.scriptType = task.result.script.type;

        $scope.pay_currency = 'USD';
        $scope.pay_amount = 0;
        $scope.pay_amount_btc = 0;

        $scope.convertPayAmountToBTC = function(currency, amount) {
            var btc_exchange_rate = parseFloat(($rootScope.currenciesMap[currency]['exchange_rate']).replace(',','.'));
            $scope.pay_amount_btc = $filter('number')(amount/btc_exchange_rate, 6);
        };

        if (task.result.script && task.result.script.url && task.result.script.url !== url) {
            $scope.query = task.result.script.url;
            url = $scope.query;
        }

        if (!task.result.script || task.result.script.length === 0) {
            $rootScope.noScript = true;
            $state.go('payment.related');
        }

        if (url !== window.document.referrer) {
            $scope.showTitle = true;
        }

        $scope.url = url;
        $scope.taskUrl = $window.btoa(url);

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
                }, function (response) {
                    $scope.showPreview = false;
                    $rootScope.handleMessage(response);
                });
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