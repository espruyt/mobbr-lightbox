'use strict';

angular.module('mobbr-lightbox.directives').directive('decorateAmount',function factory($rootScope) {
    return {
        restrict: 'C',
        scope: true,
        link: function (scope, element, attrs) {
            //setTimeout(function () {

                var settings = $rootScope.$mobbrStorage.user,
                    value = parseFloat(element.text());

                if (value < 0) {
                    element.addClass('text-error');
                }
                if (value.toLocaleString !== undefined) {
                    value = value.toLocaleString(settings && settings.language_iso || 'EUR', {
                        minimumFractionDigits: 4,
                        maximumFractionDigits: 4
                    });
                    element.text(value);
                }
            //});
        }
    }
});