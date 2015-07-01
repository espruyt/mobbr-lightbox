'use strict';

angular.module('mobbr-lightbox.filters').filter('mobbrcurrency', function ($rootScope, $sce) {

    var separator,
        ua = navigator.userAgent.toLowerCase(),
        safari;

    if (ua.indexOf('safari') != -1) {
        if (ua.indexOf('chrome') > -1) {
            safari = false;
        } else {
            safari = true;
        }
    }

    return function (amount, currency, is_html, decorate) {

        var negative,
            localestring;

        separator = Number('1.2').toLocaleString && Number('1.2').toLocaleString($rootScope.getLanguage()).substr(1,1) || '.';

        is_html = is_html || false;
        decorate = decorate || false;

        if (amount !== undefined) {

            negative = amount < 0;
            amount = Number(amount);

            if (amount.toLocaleString && !safari) {
                localestring = (currency || '') + amount.toLocaleString($rootScope.getLanguage(), {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            }

            if (!localestring) {
                var fixed_amount = (Math.abs(amount).toFixed(2) + '').split('.');
                localestring = (negative ? '-' : '') + (currency || '') + ('' + fixed_amount[0] + separator + fixed_amount[1]);
            }

            if (is_html) {

                var number = localestring.replace(currency, '') + 'test',
                    localeparts = number.split(separator),
                    frac = localestring.substr(-2, 2).toString();

                localestring = '<span class="nice-amount '
                + (decorate && (negative ? 'text-warning' : 'text-success') || '') + '">'
                + (currency && ('<span class="iso">' + currency +  '</span>') || '')
                + '<span class="sig">' + localeparts[0] + separator + '</span><span class="frac">' + frac + '</span></span>';
                localestring = $sce.trustAsHtml(localestring);
            }
        }

        return localestring;
    };
});
