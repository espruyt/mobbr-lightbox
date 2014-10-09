angular.module('mobbr-lightbox.controllers')
    .controller('PaymentController', function ($scope, $rootScope, $location, $state, $window, MobbrPayment, MobbrPerson, MobbrBalance, MobbrUri, MobbrUser, mobbrSession) {
        'use strict';

        $scope.form = {};
        $scope.loginform = {};
        $scope.formHolder = {};

        function handleMessage(response) {
            var message;
            if (response && response.data && response.data.message) {
                message = response.data.message;
            } else {
                message = response.message;
            }
            if (message) {
                if (message.type === 'error') {
                    $scope.performing = false;
                }
                $scope.message = message;
            }
        }

        var url = $rootScope.script || window.atob($state.params.hash);

        $scope.task = MobbrUri.info({ url: url }, function (response) {

            if (response.result.script && response.result.script.url && response.result.script.url !== url) {
                $scope.query = response.result.script.url;
                url = $scope.query;
            }
            $scope.url = url;
            $scope.taskUrl = $window.btoa(url);
        }, handleMessage);


        function confirm(hash) {
            $scope.confirmLoading = MobbrPayment.confirm({hash: hash}, function (response) {

                if (response.result && response.result.payment_id) {
                    $scope.paymentId = response.result.payment_id;
                    handleMessage(response);
                }
            }, handleMessage);
        }

        $scope.preview = function (showPreview, callBack) {
            $scope.showPreview = false;
            var currency = $scope.currency && $scope.currency.currency_iso || $scope.currency;
            if ($scope.amount && currency) {
                $scope.previewLoading = MobbrPayment.preview({
                    data: $scope.url,
                    currency: currency,
                    amount: $scope.amount,
                    invoiced: $scope.wantInvoices
                }, function (response) {
                    if (callBack) {
                        callBack(response.result.hash);
                    }
                    $scope.previewScript = response.result.script;
                    $scope.showPreview = showPreview;
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