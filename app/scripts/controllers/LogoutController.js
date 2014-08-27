angular.module('mobbr-lightbox.controllers')
    .controller('LogoutController', function (mobbrSession) {
        'use strict';

        mobbrSession.logout();


    });