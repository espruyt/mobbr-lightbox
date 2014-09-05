'use strict';

angular.module('mobbr-lightbox.filters').filter('mobbrcurrency', function () {
    return function(amount, currency) {

        if (amount) {
            var negative;
            amount = parseFloat(amount);
            negative = amount < 0;
            return (negative ? '-' : '') + (currency || '') + ('' + Math.abs(amount).toFixed(4));
        }
    }
});
