'use strict';

angular.module('mobbr-lightbox.services.timeout', [

        'ngStorage'

    ]).factory('idleTimeout', function ($rootScope, $timeout, $sessionStorage) {

        var timer,
            timeout = 1000 * 60 * 60,
            interval = 1000,
            idletime = 0,
            running = false;

        function resetIdleTime() {
            $sessionStorage.idletime = 0;
        }

        function activityInterval() {
            if ($sessionStorage.idletime < idletime) idletime = 0;
            idletime += interval;
            $sessionStorage.idletime = idletime;
            if ($sessionStorage.idletime > timeout) {
                $rootScope.$emit('idleTimeout:timeout');
                $sessionStorage.idletime = 0;
            }
            if (running === true) {
                timer = $timeout(activityInterval, interval);
            }
        }

        function start() {
            resetIdleTime();
            running = true;
            activityInterval();
        }

        function stop() {
            running = false;
            $timeout.cancel(timer);
        }

        $rootScope.$on('mobbrApi:authchange', function (user) {
            user && start() || stop();
        });

        return {
            start: start,
            stop: stop,
            reset: resetIdleTime
        };

    }).directive('idleTimeout', function (idleTimeout) {

        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.bind('mousemove keypress mousewheel wheel DOMMouseScroll', idleTimeout.reset);
            }
        };
    }
);;
