angular.module('mobbr-lightbox.controllers')
    .controller('PaymentController', function ($scope, $rootScope, $location, $state, $timeout, $window, $filter, $http, MobbrPayment, MobbrPerson, MobbrBalance, MobbrUri, MobbrUser, mobbrSession, uiUrl, task) {
        'use strict';

        var url = $rootScope.script || window.atob($state.params.hash);

        $scope.form = {};
        $scope.loginform = {};
        $scope.formHolder = {};
        $scope.taskUrl = $state.params.hash;
        $scope.task = task;
        $rootScope.scriptType = task.result.script.type;

        var lightbox_meta = parent.document.querySelector("meta[name='lightbox']");
        var lightbox_meta_content = lightbox_meta.getAttribute('content');
        $scope.task_metadata = (lightbox_meta_content)?angular.fromJson(lightbox_meta_content):{};

        $scope.pay_currencies = ['USD', 'EUR'];
        $scope.pay_currency = ($scope.task_metadata.currency && $scope.pay_currencies.indexOf($scope.task_metadata.currency) != -1)?$scope.task_metadata.currency:'USD';
        $scope.pay_amount = $scope.task_metadata.amount || 0;

        $scope.currency = 'BTC';
        $scope.amount = 0;

        var task_json = (task.result.metadata && task.result.metadata.json)?angular.fromJson(task.result.metadata.json):null;
        $scope.originalRecipients = (task_json && task_json.participants && angular.isArray(task_json.participants))?angular.copy(task_json.participants):(task.result.script.participants || []);

        $scope.convertPayAmountToBTC = function(currency, amount) {
            if($rootScope.currenciesMap[currency]) {
                var btc_exchange_rate = parseFloat(($rootScope.currenciesMap[currency]['exchange_rate']).replace(',','.'));
                $scope.amount = $filter('number')(amount/btc_exchange_rate, 6);
                if($scope.amount > 0) {
                    $scope.preview(true);
                }
            }
        };

        if($scope.pay_amount > 0) {
            $timeout(function() {
                $scope.convertPayAmountToBTC($scope.pay_currency, $scope.pay_amount);
            }, 1000);
        }

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
                    data: $rootScope.script && angular.toJson($rootScope.script) || $scope.url,
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

        $scope.allRecipients = angular.isArray($scope.originalRecipients)?$scope.originalRecipients:[];
        $scope.showAddRecipientsBox = function() {
            $rootScope.script = {
                url: task.result.script.url || $scope.url,
                type: task.result.script.type || 'payment',
                title: task.result.script.title || '',
                description: task.result.script.description || '',
                keywords: task.result.script.keywords || [],
                participants: $scope.allRecipients || []
            };
            $scope.showAddRecipients = true;
        };

        //Should have at least 2 recipients, site owner and at least one contributor
        if($scope.allRecipients.length < 2 && $scope.task_metadata.editable && $scope.task_metadata.ajax_url) {
            $scope.showAddRecipientsBox();
        }
        $scope.addRecipient = function(id, share) {
            var error = {message: {text: "Enter valid email address"}, status: [0]};

            var email_regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;
            var url_regex = /\b(?:https?:\/\/)[-a-z0-9+&@#\/%?=~_|!:,.;]*[-a-z0-9+&@#\/%=~_|]/i;

            var is_valid_email = email_regex.test(id);
            if(!is_valid_email && !url_regex.test(id)) {
                error.message.text = "Enter valid email address or profile url";
                $rootScope.handleMessage(error);
                return;
            }

            share = parseInt(share);
            if(share <= 0 || share > 100) {
                error.message.text = "Enter a number between 0 and 100";
                return;
            }

            if(is_valid_email)
                id = 'mailto:'+id;

            $scope.allRecipients.push({id: id, share: share, role: 'contributor'});
            $scope.recipient_id = '';
            $scope.recipient_share = '';
        };

        $scope.clearAllRecipients = function() {
            $scope.allRecipients = (angular.isArray($scope.allRecipients) && $scope.allRecipients.length > 0)?[$scope.allRecipients[0]]:[];
        };

        function jQueryLikeParamSerializer(params) {
            if (!params) return '';
            var parts = [];
            serialize(params, '', true);
            return parts.join('&');

            function sortedKeys(obj) {
                var keys = [];
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        keys.push(key);
                    }
                }
                return keys.sort();
            }

            function forEachSorted(obj, iterator, context) {
                var keys = sortedKeys(obj);
                for (var i = 0; i < keys.length; i++) {
                    iterator.call(context, obj[keys[i]], keys[i]);
                }
                return keys;
            }

            function serializeValue(v) {
                if (angular.isObject(v)) {
                    return angular.isDate(v) ? v.toISOString() : toJson(v);
                }
                return v;
            }

            function serialize(toSerialize, prefix, topLevel) {
                if (toSerialize === null || angular.isUndefined(toSerialize)) return;
                if (angular.isArray(toSerialize)) {
                    angular.forEach(toSerialize, function(value, index) {
                        serialize(value, prefix + '[' + (angular.isObject(value) ? index : '') + ']');
                    });
                } else if (angular.isObject(toSerialize) && !angular.isDate(toSerialize)) {
                    forEachSorted(toSerialize, function(value, key) {
                        if(key != "$$hashKey") {
                            serialize(value, prefix +
                                (topLevel ? '' : '[') +
                                key +
                                (topLevel ? '' : ']'));
                        }
                    });
                } else {
                    parts.push(encodeURIComponent(prefix) + '=' + encodeURIComponent(serializeValue(toSerialize)));
                }
            }
        }

        $scope.closeAddRecipientsBox = function() {
            //TODO: Switch to using $httpParamSerializerJQLike in place of jQueryLikeParamSerializer when upgrading to angular >= 1.4.0
            $http.post(
                $scope.task_metadata.ajax_url + '?action=add_post_meta',
                jQueryLikeParamSerializer({url: $scope.url, participants: $scope.allRecipients}),
                {headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
                .then(function(response) {
                    $scope.showAddRecipients = false;
                    $rootScope.script.participants = $scope.allRecipients;

                    if($scope.amount > 0) {
                        $scope.preview(true);
                    }
                }, function(response) {
                    console.log(response);
                });
        };
    });